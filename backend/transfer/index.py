import json
import os
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Transfer money between users or to external banks
    Args: event with httpMethod, body (from_user_id, to_phone/to_card, amount, type)
    Returns: HTTP response with transfer result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    from_user_id = body_data.get('from_user_id')
    transfer_type = body_data.get('type')
    amount = body_data.get('amount')
    description = body_data.get('description', '')
    
    if not from_user_id or not amount or not transfer_type:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'from_user_id, amount, and type required'}),
            'isBase64Encoded': False
        }
    
    amount_decimal = Decimal(str(amount))
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT balance FROM users WHERE id = %s", (from_user_id,))
        sender_result = cursor.fetchone()
        
        if not sender_result:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Sender not found'}),
                'isBase64Encoded': False
            }
        
        sender_balance = sender_result[0]
        
        if sender_balance < amount_decimal:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Insufficient funds'}),
                'isBase64Encoded': False
            }
        
        if transfer_type == 'sber_transfer':
            to_phone = body_data.get('to_phone')
            
            if not to_phone:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'to_phone required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("SELECT id, full_name FROM users WHERE phone = %s", (to_phone,))
            recipient = cursor.fetchone()
            
            if not recipient:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Recipient not found'}),
                    'isBase64Encoded': False
                }
            
            to_user_id = recipient[0]
            recipient_name = recipient[1]
            
            if to_user_id == from_user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Cannot transfer to yourself'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "UPDATE users SET balance = balance - %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING balance",
                (amount_decimal, from_user_id)
            )
            new_sender_balance = cursor.fetchone()[0]
            
            cursor.execute(
                "UPDATE users SET balance = balance + %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (amount_decimal, to_user_id)
            )
            
            cursor.execute(
                "INSERT INTO transactions (user_id, type, amount, description, category) VALUES (%s, %s, %s, %s, %s)",
                (from_user_id, 'transfer_out', amount_decimal, f'Перевод {recipient_name}', 'transfers')
            )
            
            cursor.execute(
                "INSERT INTO transactions (user_id, type, amount, description, category) VALUES (%s, %s, %s, %s, %s)",
                (to_user_id, 'transfer_in', amount_decimal, f'От пользователя', 'transfers')
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'new_balance': float(new_sender_balance),
                    'recipient': recipient_name,
                    'message': f'Успешно переведено {amount} ₽'
                }),
                'isBase64Encoded': False
            }
        
        elif transfer_type == 'external_transfer':
            to_card = body_data.get('to_card')
            bank_name = body_data.get('bank_name', 'Внешний банк')
            
            if not to_card:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'to_card required'}),
                    'isBase64Encoded': False
                }
            
            commission = amount_decimal * Decimal('0.01')
            total_amount = amount_decimal + commission
            
            if sender_balance < total_amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': f'Insufficient funds. Need {float(total_amount)} ₽ (including 1% commission)'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "UPDATE users SET balance = balance - %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING balance",
                (total_amount, from_user_id)
            )
            new_sender_balance = cursor.fetchone()[0]
            
            cursor.execute(
                "INSERT INTO transactions (user_id, type, amount, description, category) VALUES (%s, %s, %s, %s, %s)",
                (from_user_id, 'external_transfer', total_amount, f'Перевод в {bank_name} на карту {to_card[-4:]}', 'transfers')
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'new_balance': float(new_sender_balance),
                    'amount': float(amount_decimal),
                    'commission': float(commission),
                    'total': float(total_amount),
                    'message': f'Успешно переведено {amount} ₽ + комиссия {float(commission)} ₽'
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid transfer type'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
