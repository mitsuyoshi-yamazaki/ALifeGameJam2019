# ALifeGameJam2019

This is an artificial life ecosystem created at ALife Game Jam 2019.

https://mitsuyoshi-yamazaki.github.io/ALifeGameJam2019

## Gallery

![](resources/docs/image001.png)
![](resources/docs/image002.gif)
![](resources/docs/image003.gif)

## Run Locally

`$ open /Applications/Google\ Chrome.app/ --args --disable-web-security --user-data-dir`
then open index.html on Chrome

### Parameters

- art_mode
  - 1(enable) or 0(disable)
		- Enables drawing mode
- population_size
  - number(1~)
		- Initial population size
- single_gene
  - 1(enable) or 0(disable)
  - Starts with only one species
- mutation_rate
  - number(0~1), 0.001~0.03 recommended
  - The mutation rate when they reproduce

## Build

### Setup

Install TypeScript
https://www.typescriptlang.org/docs/home.html
`$ npm install -g typescript`


### Build source files into JS file.

```shell
$ cd ALifeGameJam2019
# Compile TS source files
$ tsc
```