# Semantic Cities Survey
### Web-app to generate the interface for a custom "Semantic Cities Framework" survey and gather the results
--------------

This app is part of the "Semantic Cities Framework", which intends to offer a efficient and effective way to gather a population's mental map towards any given area.

To achieve this, based on a given survey specification, this tool generates an interface that allows users to participate on the survey.

To publish a Semantic Cities survey one needs:

- a host server
- a database
- this repository's files

Note that the host server is just that: a host. Thus, there is no need to deploy a dedicated server, and there is only need to deploy the due app files into a host. This particular decision also influenced some of the project's implementation; [details can be seen bellow](#implementation-details).

## Publishing a Semantic Cities Survey
The whole process of publishing this kind of surveys consists of:

1. Specifying a "Semantic Cities Survey" JSON;
    - That specification should be put into `src/client/app/data`
2. [if needed] Editing, on `src/client/app/core/constants.js`, the `hostPath` constant, to match the directory structure where the app will be deployed;
3. [if needed] Editing, on `src/client/index.html`, the different `build:*` comments, with the same path prefix used on the previous step;
4. Editing the `src/client/app/db/db-config.php` file, giving the information needed to access the database;
    - There is no need to create a table on the database. If the specified isn't detected, the scripts will create one. If you want to create the table yourself, use the command `CREATE TABLE $table_name (user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, participation MEDIUMTEXT)`
5. Opening a terminal and making `gulp build` on the project's root directory;
6. Uploading the necessary files to the host, in the same directory as specified in steps 2 and 3. Given that you are uploading the files to a `survey/` directory on the host:
    - Upload the `build/index.html` into `survey/`; in the host the path should be, for our example, `survey/index.html`
    - Upload both `build/survey/js` and `build/survey/styles` to the host, but only those directories, not their parent; in the host their path should be, for our example, `survey/js` and `survey/styles`
    - Upload `src/client/app/db`; in the host the path should be, for our example, `survey/db`
    - Upload `src/client/app/data`; in the host the path should be, for our example, `survey/data`

## Implementation notes
This project's code structure follows the [Hottowel SPA Template](https://github.com/johnpapa/generator-hottowel) for Angular.JS, generated from [Yeoman](http://yeoman.io/). The most relevant technologies are [Leaflet.JS](http://leafletjs.com/), for basic map manipulation, and [Leaflet.FreeDraw](https://github.com/Wildhoney/Leaflet.FreeDraw), for the crucial interaction of drawing on the map.

### The `server/` folder
In the project files there is a `server/` folder. It contains a simple Node.js app to deploy into a compatible server. However, as previously mentioned, this app runs on the client side only, and thus there is no need to deploy such a server. The folder is there only temporarily, to allow the correct building process, that in turn was imported from the [Hottowel SPA Template](https://github.com/johnpapa/generator-hottowel). In time, it is something to remove, but since it doesn't interfere with the final result, it's a low-priority task.

### Mobile version?
This web-app is meant for ***desktop only**, since it is a too complex interface and interaction for mobile devices. A mobile version is something to consider, though, as it would help in getting more participants for any survey.