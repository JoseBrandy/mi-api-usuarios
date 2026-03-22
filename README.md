# 🧑‍💻 API REST de Usuarios

API RESTful construida con Python y Flask.

## 🚀 Instalación

```bash
# Crear entorno virtual
python -m venv .venv
# En Windows
.venv\Scripts\activate

# En Mac/Linux
source .venv/bin/activate 

# Instalar dependencias
pip install -r requirements.txt
```

## ▶️ Ejecutar

```bash
python run.py
```

## 📁 Estructura

```
src/
├── controllers/   # Lógica de negocio
├── routes/        # Definición de rutas
├── models/        # Modelos de datos
├── middlewares/   # Funciones intermedias
└── config/        # Configuración
```

## 🔑 Variables de entorno

Crear un archivo `.env` en la raíz basándote en `.env.example`:
```
cp .env.example .env
```

Luego completá los valores en el `.env`.
