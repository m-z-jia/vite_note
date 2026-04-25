# JSON.stringify 超详细解析

`JSON.stringify()` 是 JavaScript **内置的核心方法**，作用是：**把 JavaScript 中的任意值（对象、数组、字符串、数字等）转换成标准的 JSON 格式字符串**。

它是前端开发、接口数据传输、本地存储（localStorage）中最常用的方法之一，几乎所有数据持久化/网络传输场景都会用到。

## 一、基础语法

```javascript
JSON.stringify(value, replacer?, space?)
```

### 参数说明

1. **value**（必选）：要转换成 JSON 字符串的 JavaScript 值（对象、数组、字符串、数字、布尔、null）。
2. **replacer**（可选）：过滤器/自定义转换规则，可以是**数组**或**函数**。
3. **space**（可选）：格式化缩进，让输出的 JSON 更易读（数字/字符串）。

### 返回值

返回一个**标准 JSON 格式的字符串**，如果转换失败会抛出错误。

## 二、最基础用法（只传第一个参数）

直接把 JS 值转成 JSON 字符串：

```javascript
// 1. 对象
const obj = { name: "小明", age: 18, isStudent: true };
const json = JSON.stringify(obj);
console.log(json);
// 输出：{"name":"小明","age":18,"isStudent":true}

// 2. 数组
console.log(JSON.stringify([1, "a", true]));
// 输出：[1,"a",true]

// 3. 原始类型
console.log(JSON.stringify("hello")); // "hello"
console.log(JSON.stringify(123)); // 123
console.log(JSON.stringify(null)); // null
console.log(JSON.stringify(true)); // true
```

## 三、关键特性：哪些值会被自动忽略/特殊处理

这是**最容易踩坑**的地方，必须记住：

### 1. 会被**直接忽略**的值

- `undefined`
- `Symbol` 类型（Symbol()、Symbol.for()）
- **函数**
- **以 undefined/Symbol/函数 为值的对象属性**

```javascript
const obj = {
  a: undefined,
  b: Symbol("test"),
  c: function () {},
  d: 123,
};

console.log(JSON.stringify(obj));
// 输出：{"d":123}  前三个属性直接消失！
```

### 2. 数组中的特殊值

数组中的 `undefined`、`Symbol`、函数会被转换成 `null`：

```javascript
console.log(JSON.stringify([1, undefined, Symbol(), function () {}]));
// 输出：[1,null,null,null]
```

### 3. 特殊对象处理

- **Date 对象**：会被转成 ISO 日期字符串
- **RegExp（正则）**：会被转成空对象 `{}`
- **循环引用对象**（A引用B，B引用A）：**直接报错**

```javascript
// Date
JSON.stringify(new Date());
// 输出："2025-08-20T12:34:56.789Z"

// 正则
JSON.stringify(/abc/);
// 输出：{}
```

## 四、第二个参数：replacer（过滤器）

replacer 可以精准控制**哪些属性要转换、怎么转换**，支持两种形式：

### 1. 数组形式：只保留指定属性

```javascript
const obj = { name: "小明", age: 18, gender: "男" };

// 只保留 name 和 age 属性
const json = JSON.stringify(obj, ["name", "age"]);
console.log(json);
// 输出：{"name":"小明","age":18}
```

### 2. 函数形式：自定义转换逻辑

函数接收两个参数：`key`（属性名）、`value`（属性值），**返回你想要转换后的值**。

```javascript
const obj = { name: "小明", age: 18, score: 90 };

const json = JSON.stringify(obj, (key, value) => {
  // 把年龄改成 20
  if (key === "age") return 20;
  // 分数不显示
  if (key === "score") return undefined;
  // 其他值正常返回
  return value;
});

console.log(json);
// 输出：{"name":"小明","age":20}
```

## 五、第三个参数：space（格式化缩进）

让 JSON 字符串**带缩进、更易读**，开发调试必备：

### 1. 数字：缩进 N 个空格

```javascript
const obj = { name: "小明", age: 18 };
const json = JSON.stringify(obj, null, 2); // 缩进 2 个空格
console.log(json);
```

输出：

```json
{
  "name": "小明",
  "age": 18
}
```

### 2. 字符串：用指定字符缩进（如制表符 \t）

```javascript
JSON.stringify(obj, null, "\t");
```

## 六、高级特性：toJSON() 方法

如果一个对象**自己实现了 `toJSON()` 方法**，`JSON.stringify` 会**优先调用这个方法**，用它的返回值作为转换结果。

这是自定义对象序列化的最强方式：

```javascript
const user = {
  name: "小明",
  age: 18,
  // 自定义序列化
  toJSON() {
    return { userName: this.name };
  },
};

console.log(JSON.stringify(user));
// 输出：{"userName":"小明"}
```

## 七、常见错误与异常

### 1. 循环引用对象

```javascript
const a = {};
const b = { a };
a.b = b;
JSON.stringify(a); // 抛出 TypeError: Converting circular structure to JSON
```

### 2. BigInt 类型

`BigInt` 无法被序列化，会直接报错：

```javascript
JSON.stringify(10n); // TypeError: BigInt value can't be serialized
```

## 八、典型使用场景

### 1. 本地存储 localStorage

localStorage 只能存字符串，不能存对象：

```javascript
const user = { name: "小明" };
localStorage.setItem("user", JSON.stringify(user));
```

### 2. AJAX / Fetch 发送请求

后端接口通常只接收 JSON 字符串：

```javascript
fetch("/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "小明" }),
});
```

### 3. 深拷贝简单对象

```javascript
const obj = { a: 1, b: { c: 2 } };
const copy = JSON.parse(JSON.stringify(obj));
```

> 注意：只能拷贝**无函数、无undefined、无循环引用、无Symbol**的对象。

## 总结

1. **核心作用**：JS 值 → 标准 JSON 字符串，用于传输/存储。
2. **3 个参数**：值 + 过滤器(replacer) + 格式化(space)。
3. **自动忽略**：`undefined`/`Symbol`/函数，数组中会转成 `null`。
4. **常用场景**：localStorage、接口请求、简单深拷贝。
5. **坑点**：循环引用、BigInt、正则会报错/异常转换。
