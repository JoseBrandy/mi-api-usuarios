from dotenv import load_dotenv
from src.app import app
import os

load_dotenv()

PORT = int(os.getenv('PORT', 3000))

if __name__ == '__main__':
    print(f'Servidor corriendo en http://localhost:{PORT}')
    app.run(port=PORT, debug=True)
    
