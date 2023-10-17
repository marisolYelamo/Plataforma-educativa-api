# Plataforma 5 - Pledu API

RESTful API hecha con [Typescript](https://www.typescriptlang.org/).

## Tech Stack

- Typescript
- Postgres
- Docker
- Express (Routing)
- Sequelize (ORM)

Solo hace falta GIT y Docker para correr el proyecto.

## Usage

#### Cloná el repositorio (si no lo hiciste)

```bash
# ssh is highly recomended
git clone git@gitlab.com:plataforma5_tech/pledu-api.git
```

#### Copiá el ejemplo de `.env` y pedi la data real si necesitas conectarte a otro servicio

```
cp .env.example .env
```

#### Build and run con docker.

```bash
# setup docker-compose (build local-server)
docker-compose build local

# run docker images (db and server)
docker-compose up -d db && docker-compose up local
```

Al momento de crear la imagen se carga un dump con data.

Podes usar alguno de estos usuarios de entrada:

- Super Admin:
  **email**: superadmin@plataforma5.la
  **pass**: superadmin1234

- Admin:
  **email**: admin@plataforma5.la
  **pass**: admin1234

- Student:
  **email**: student@plataforma5.la
  **pass**: student1234

- Editor:
  **email**: editor@plataforma5.la
  **pass**: editor1234

\_Recomendado crear tu propio usuario con permisos para familiarizarte con el flujo de usuarios y permisos.

## Envs & Config

Las variables de entorno necesarias estan validadadas en la carpeta `config`.

Todos los proyectos deberían apuntar a los entornos de dev a la hora de interactuar con otro servicio
esta api no tiene otra interacciones mas que los servicios de terceros que usamos


- Discord (Comunidad)
