Sistema de Inventario – Ferretería Alejandra
Descripción del Proyecto

Sistema web de gestión de inventario y movimientos para una ferretería.

El proyecto integra:

* Frontend: React + Vite

* Backend: Node.js + Express

* Base de datos: MongoDB

* Control de versiones: Git y GitHub

El sistema está diseñado para uso administrativo, con acceso privado mediante autenticación.

Objetivo del Proyecto

* Desarrollar una aplicación web funcional que permita:

* Gestionar productos de una ferretería

* Registrar entradas y salidas de inventario

* Almacenar información en una base de datos NoSQL

* Aplicar buenas prácticas de desarrollo y control de versiones

![alt text](<Captura de pantalla 2025-12-29 223403.png>)

Funcionalidades del Sistema

Autenticación

* Inicio de sesión privado

* Validación de credenciales desde MongoDB

* Acceso restringido al sistema

![alt text](<Captura de pantalla 2026-01-02 215347.png>)

Gestión de Productos

* Registro de productos

* Visualización de productos disponibles

* Asociación de productos con movimientos de inventario

![alt text](image.png)

Movimientos de Inventario

El sistema permite registrar y visualizar movimientos de inventario diferenciando:

* Entradas: Aumento de stock

* Salidas: Disminución de stock

Cada movimiento contiene:

* Producto asociado

* Tipo de movimiento (entrada / salida)

* Cantidad

* Fecha del movimiento

Los movimientos se muestran visualmente diferenciados para facilitar su lectura.

![alt text](image-1.png) 

Base de Datos – MongoDB

Se utilizó MongoDB como sistema gestor de base de datos, con las siguientes colecciones:

* Usuarios

* Productos

* Movimientos

La relación entre productos y movimientos se maneja mediante referencias, permitiendo mantener la integridad de los datos.

![alt text](<Captura de pantalla 2025-12-29 211619.png>)

Tecnologías Utilizadas

* React

* Vite

* Node.js

* Express

* MongoDB

* Mongoose

* Axios

* Git

* GitHub

Autor 

EVELING ALEJANDRA VELEZ BRIONES
