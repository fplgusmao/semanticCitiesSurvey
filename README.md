# Semantic Cities Survey
### Web-app to generate the interface for a custom "Semantic Cities Framework" survey and gather the results
--------------

This app is part of the "Semantic Cities Framework", which intends to offer a efficient and effective way to gather a population's mental map towards any given area.

To achieve this, based on a given survey specification, this tool generates an interface that allows users to participate on the survey.

To publish a Semantic Cities survey one needs:

- a host server
- a database
- this repository's files

The host server is just that: a host. Thus, there is no need to deploy a dedicated server, and there is only need to deploy the due app files into a host.

The whole process of publishing this kind of surveys consists of:

1. Specifying a "Semantic Cities Survey" JSON;
    - That specification should be put into `src/client/app/data`
2. [if needed] Editing, on `src/client/app/core/constants.js`, the `hostPath` constant, to match the directory structure where the app will be deployed;
3. [if needed] Editing, on `src/client/index.html`, the different `build:*` comments, with the same path prefix used on the previous step;
4. Editing the `src/client/app/db/db-config.php` file, giving the information needed to access the database;
    - There is no need to create a table on the database. If the specified isn't detected, the scripts will create one. If you want to create the table yourself, use the command `CREATE TABLE $table_name (user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, participation MEDIUMTEXT)`
5. Making `gulp build` on the project's root;
6. Uploading the necessary files to the host, in the same directory as specified in steps 2 and 3.
    - Upload the `build/index.html`
    - Upload both `build/<custom path>/js` and `build/<custom path>/styles` to the host, but only those directories, not their parents
    - Upload `src/client/app/db`
    - Upload `src/client/app/data`
