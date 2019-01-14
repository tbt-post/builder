const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const {localRootPath} = process.env;


const beforeTamplate = `
import React, {Component, Fragment, Suspense, lazy} from "react";
import {Route, Switch, withRouter} from 'react-router-dom';
`;


const moduleTamplate = (option) => option.map(module => `
export const ${module.moduleName}Lazy = lazy(() => import(/* webpackChunkName: '${module.moduleChunk}' */ '${module.modulePath}'));
export const ${module.moduleName} = ()=><Suspense fallback={<Fragment></Fragment>}>
    <${module.moduleName}Lazy/>
</Suspense>;
`).join('');


const routerTamplate = (routerName, option) => {
    const routers = option.map(module => !module.url ? null : `
     <Route exact path={match.path + '${module.url}'} component={${module.moduleName}}/>
`);


    return `
export class ${routerName}
    extends Component {
    render() {
        const {match} = this.props;
        return (
            <Fragment>
                <Switch>
                    ${routers.join('')}
                </Switch>
            </Fragment>
        )
    }
}
`
};

const afterTamplate = (option) => `
export default withRouter(${option.routerName})
`;


module.exports = (folderName = '/') => {
    glob(path.join('./', localRootPath, folderName, `/**/!(${folderName}).spec.json`), {}, (err, files) => {
        console.log(files);
        const basePath = path.join(localRootPath, folderName);
        if (files.length) {
            let tmpl = beforeTamplate;

            const routerName = 'GenRouter' + folderName.split(/[-.]/g).map(string => string.charAt(0).toUpperCase() + string.slice(1)).join('');

            const options = [];

            files.forEach(file => {
                const data = fs.readJsonSync(file);
                const moduleName = 'Gen' + data.fileName.split(/[-.]/g).map(string => string.charAt(0).toUpperCase() + string.slice(1)).join('');
                const modulePath = `./${path.relative(basePath, data.filePathJs)}`;
                const moduleChunk = `${data.folderName.replace(/\//gi, '.')}.${data.fileName}`;
                options.push({
                    moduleName: moduleName,
                    modulePath: modulePath,
                    moduleChunk: moduleChunk,
                    url: data.url
                })
            });


            tmpl = tmpl + moduleTamplate(options);


            tmpl = tmpl + routerTamplate(routerName, options);

            tmpl = tmpl + afterTamplate({
                routerName: routerName
            });

            fs.writeFileSync(path.join('./', basePath, `${folderName !== '.' ? folderName : 'common'}.router.js`), tmpl, '');
        }
    })
};