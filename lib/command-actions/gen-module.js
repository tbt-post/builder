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
export const ${module.moduleName} = (props)=><Suspense fallback={<Fragment></Fragment>}>
    <${module.moduleName}Lazy {...props}/>
</Suspense>;
`).join('');


const routerTemplate = (routerName, option) => {

    const routers = option.sort((a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
    }).map(module => typeof module.url === 'undefined' ? null : (typeof module.url === 'object' ? module.url.map(url => (
        `\n<Route exact={${module.exact}} path={match.path + '${url}'} component={${module.moduleName}}/>\n`
    )).join('') : `\n<Route exact={${module.exact}} path={match.path + '${module.url}'} component={${module.moduleName}}/>\n`));


    return `
export class ${routerName}  extends Component {
    render() {
        const {match, location} = this.props;
        return (
            <Fragment>
                 <Switch location={location} match={match}>
                    ${routers.join('')}
                 </Switch>
            </Fragment>
        )
    }
}
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