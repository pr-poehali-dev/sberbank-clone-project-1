import json
import os
import psycopg2
from typing import Dict, Any
from decimal import Decimal

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage user transactions - deposit, withdraw, transfer, get history
    Args: event with httpMethod, body (user_id, amount, type, description)
    Returns: HTTP response with transaction data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(
                "SELECT id, type, amount, description, category, status, created_at FROM transactions WHERE user_id = %s ORDER BY created_at DESC LIMIT 50",
                (user_id,)
            )
            transactions = cursor.fetchall()
            
            result = []
            for t in transactions:
                result.append({
                    'id': t[0],
                    'type': t[1],
                    'amount': float(t[2]),
                    'description': t[3],
                    'category': t[4],
                    'status': t[5],
                    'created_at': t[6].isoformat() if t[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'transactions': result}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            amount = body_data.get('amount')
            trans_type = body_data.get('type')
            description = body_data.get('description', '')
            category = body_data.get('category')
            
            if not user_id or not amount or not trans_type:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id, amount, and type required'}),
                    'isBase64Encoded': False
                }
            
            amount_decimal = Decimal(str(amount))
            
            if trans_type == 'deposit':
                cursor.execute(
                    "SELECT id FROM users WHERE id = %s",
                    (user_id,)
                )
                if not cursor.fetchone():
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    "UPDATE users SET balance = balance + %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING balance",
                    (amount_decimal, user_id)
                )
                result = cursor.fetchone()
                new_balance = result[0] if result else 0
                
                cursor.execute(
                    "INSERT INTO transactions (user_id, type, amount, description, category) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (user_id, trans_type, amount_decimal, description, category)
                )
                trans_id = cursor.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'transaction_id': trans_id,
                        'new_balance': float(new_balance)
                    }),
                    'isBase64Encoded': False
                }
            
            elif trans_type == 'withdraw':
                cursor.execute("SELECT balance FROM users WHERE id = %s", (user_id,))
                balance_result = cursor.fetchone()
                
                if not balance_result:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
                
                current_balance = balance_result[0]
                
                if current_balance < amount_decimal:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Insufficient funds'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute(
                    "UPDATE users SET balance = balance - %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING balance",
                    (amount_decimal, user_id)
                )
                result = cursor.fetchone()
                new_balance = result[0] if result else 0
                
                cursor.execute(
                    "INSERT INTO transactions (user_id, type, amount, description, category) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                    (user_id, trans_type, amount_decimal, description, category)
                )
                trans_id = cursor.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'transaction_id': trans_id,
                        'new_balance': float(new_balance)
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid transaction type'}),
                    'isBase64Encoded': False
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()