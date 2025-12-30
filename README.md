# PsychologicalEvaluation
Psychological Evaluation System

Front end para el proyecto Psychological Evaluation System

## Configuración del proyecto

### Clonar Proyecto

Clone el proyecto **PsychologicalEvaluation** del repositorio en git.

Ejecute el comando `npm install` para descargar e instalar las dependencias necesarias para el proyecto. 

Dentro del archivo *_theming.scss* en la ruta **PsychologicalEvaluation\node_modules\\@angular\material** despues de la linea 683:
~~~
A700: #aa00ff,
~~~
agregar las siguientes lineas:
~~~
Dark_Lavender: #75518c,
Eminence: #612C7E,
~~~

y, despues de la linea 916:
~~~
A700: #00c853,
~~~
agregar la siguiente linea:
~~~
Viridian_Green: #00949b,
~~~

### Ejecutar en Desarrollo
Ejecutar `ng serve` para un servidor de desarrollo:

+ Para ejecutar la version en **Inglés** ejecutar el comando `ng serve --configuration=en`. 

+ Para ejecutar la version en **Español** ejecutar el comando `ng serve --configuration=es`.

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambia alguno de los archivos de origen.

### Andamio de código
Ejecutar `ng generate component component-name` para generar un nuevo componente. También puede utilizar `ng generate directive|pipe|service|class|module`.

### Archivos de traducción
Ejecutar `ng xi18n --output-path translate` para generar un archivo de traduccion, este debe editarlo, cambiarlo de nombre y pegarlo en otra ruta.

## Configuraciones adicionales

### Construir

Ejecutar `ng build` para construir el proyecto. Los artefactos de construcción se almacenarán en el `dist/` directorio. Usa la `-prod` bandera para una construcción de producción.

+ Versión general `ng build --prod --optimization --build-optimizer --aot --base-href / --deploy-url / --i18n-locale=es --output-path=dist/ROOT`


---

## Ayuda adicional
Para obtener más ayuda sobre el uso de CLI de Angular `ng help` o vaya a consultar el README de [Angular CLI](https://github.com/angular/angular-cli/blob/master/README.md).
