# glsl-linter 着色器代码格式化
vscod需要安装C/C++和Clang-Format
```bash
"[glsl]": {
        "editor.defaultFormatter": "xaver.clang-format"
},
"clang-format.executable": "C:/Users/zhang/.vscode/extensions/ms-vscode.cpptools-0.30.0-insiders5/LLVM/bin/clang-format.exe"
  ```

# .glsl .vert .frag
## .vert
顶点着色器代码文件
##  .frag
片元着色器代码文件
## .glsl 
一般用于存放公用的变量名和方法,类似utils
## include
用于编译/运行时，把指定的代码插入进来
glsl一般用于这种 #include 引用的代码
实现方式一般有两种：three在运行时解析替换，glslify是在编译js时打包进去（three这种要好一些，glslify会让包变大）

# 在线glsl-edit
## website
[zhouzhili-glgl-edit](http://zhouzhili.github.io/dist_frag/index.html)  [gong-glsl-show](https://www.aigisss.com/glsl/#/getting_start)
## repositories
[webGL-fragment-render](https://github.com/zhouzhili/webGL-fragment-render)
```bash
这里的#include 采用的是加载的时候解析
```
