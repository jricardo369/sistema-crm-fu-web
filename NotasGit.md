# Notas Git

## Como bajar cambios de repositorio base a tu FORK

Antes de bajar los cambios asegurar que hallas hecho commit de tus ajustes locales

### Se asigna un nombre al repositorio base en este caso es portala
~~~
git remote add portala https://github.com/jricardo369/dental-portal.git
~~~

### Se bajan cambios del repositorio base a tu local
~~~
git fetch portala
~~~

### Nos aseguramos que estemos en la rama dev
~~~
git checkout dev
~~~

### Hacemos merge del portal base a nuestro dev del FROK
~~~
git merge portala/dev
~~~
