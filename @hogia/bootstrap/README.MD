# Hogia Bootstrap

## Documentation
Here is the documentation for hogia-bootrap: https://bootstrap.hogia.se/ 

## Using HogiaBootstrap in your projet 
Add .npmrc

```shell
 In your project there should be a .npmrc file, if not add one.
 Then add this in the file:

 @fortawesome:registry=https://npm.fontawesome.com/
 //npm.fontawesome.com/:_authToken=D5259E54-AFB6-44CE-BF08-5A067FC7AD84
```

## Test changes in Hogia Bootstrap locally.
1. Download INF_HogiaBootstrap - https://Hogia@dev.azure.com/Hogia/Infrastructure/_git/INF_HogiaBootstrap
2. Install Gulp on your computer.
```shell
 npm install
 npm install -g gulp
```
3. Download Bootstrap Doc.
######Use this project to see changes and test the bootstrap.
```shell
 git clone https://Hogia@dev.azure.com/Hogia/Infrastructure/_git/MISC_HogiaBootstrapDocs
```

###Installing a local module using npm. 
OPTION 1

```shell
 CD ./INF_HogiaBootstrap
 npm link
	
 CD ./MISC_HogiaBootstrapDocs/node_modules
 npm link @hogia/bootstrap
```
OPTION 2

```shell
 CD ./MISC_HogiaBootstrapDocs
 npm install /path (path to INF_HogiaBootstrap)
```

##Working with the stylesheets.
```shell
 gulp build
 gulp watch
```


# See changes in stylesheet
#####INF_HogiaBootstrap
```shell
 gulp watch
```
MISC_HogiaBootstrapDocs
```shell
 npm run build
 npm run start
```
With "npm run start" (running for MISC_HogiaBootstrapDocs) and "gulp watch" (running for INF_HogiaBootstrap) -
the stylesheet updates on save.


