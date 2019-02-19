const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const {localRootPath} = process.env;


const beforeTemplate = `
import React, {Component, Fragment, Suspense, lazy} from "react";
import {Route, Switch, withRouter} from 'react-router-dom';
import i18next from "i18next";
`;


const moduleTemplate = (option) => option.map(module => `
export const ${module.moduleName}Lazy = lazy(() => import(/* webpackChunkName: '${module.moduleChunk}' */ '${module.modulePath}'));
export const ${module.moduleName}Option = {...require('${module.modulePathSpec}'),${module.title ? ("title:i18next.t('" + module.moduleChunk + ".title','" + module.title + "'),") : '\t'} moduleChunk:'${module.moduleChunk}'};
export const ${module.moduleName} = (props)=><Suspense fallback={<div className="loading-module"><div></div></div>}>
    <${module.moduleName}Lazy {...props}/>
</Suspense>;
`).join('');


const routerTemplate = (routerName, option) => {

    const _option = option
        .filter(module => (
            typeof module.url === 'undefined' ? false : module)
        )
        .sort((a, b) => {
            if (a.order < b.order) return -1;
            if (a.order > b.order) return 1;
            return 0;
        });


    const routers = _option.map(module => {
        if (typeof module.url === 'string') module.url = [module.url];
        let result = '';
        module.url.forEach(url => {
            result += `{
    url:'${url}',
    id: '${module.id}',
    component: ${module.moduleName}
    },\n`
        });
        return result
    })


    console.log(routers);


    return `
export const  ${routerName} = [\n${routers.join('')}\n];
`
};

const afterTemplate = (option) => `
export default ${option.routerName}
`;


module.exports = (folderName = '/') => {
    glob(path.join('./', localRootPath, folderName, `/**/!(${folderName}).spec.json`), {}, (err, files) => {

        const basePath = path.join(localRootPath, folderName);
        if (files.length) {
            let tmpl = beforeTemplate;

            const routerName = 'GenRouter' + folderName.split(/[-.]/g).map(string => string.charAt(0).toUpperCase() + string.slice(1)).join('');

            const options = [];

            files.forEach((file, key) => {
                const data = fs.readJsonSync(file);
                const moduleName = 'Gen' + data.fileName.split(/[-.]/g).map(string => string.charAt(0).toUpperCase() + string.slice(1)).join('');
                const modulePath = `./${path.relative(basePath, data.filePathJs)}`;
                const modulePathSpec = `./${path.relative(basePath, file)}`;
                const moduleChunk = `${data.folderName.replace(/\//gi, '.')}.${data.fileName}`;
                options.push({
                    moduleName: moduleName,
                    modulePath: modulePath,
                    modulePathSpec: modulePathSpec,
                    moduleChunk: moduleChunk,
                    id: data.id,
                    url: data.url,
                    title: data.title,
                    exact: typeof data.exact !== "undefined" ? data.exact : true,
                    order: typeof data.order !== "undefined" ? data.order : key
                })
            });


            tmpl = tmpl + moduleTemplate(options);

            tmpl = tmpl + routerTemplate(routerName, options);

            tmpl = tmpl + afterTemplate({
                routerName: routerName
            });

            fs.writeFileSync(path.join('./', basePath, `${folderName !== '.' ? folderName : 'common'}.router.js`), tmpl, '');
        }
    })
};