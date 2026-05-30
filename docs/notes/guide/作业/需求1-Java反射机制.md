# Java反射机制

## 一、什么是反射

**反射（Reflection）** 是 Java 提供的一种强大机制，允许程序在**运行时**动态地：

- 获取类的完整结构信息（类名、方法、字段、构造器、注解等）
- 创建对象实例
- 调用方法
- 访问和修改字段（包括私有成员）

反射是 Java 被视为"动态语言"的关键支撑。

## 二、核心 API 类

| 类名 | 说明 |
|------|------|
| `Class` | 类的类，反射的入口，代表一个类或接口 |
| `Constructor` | 构造方法 |
| `Field` | 成员变量 |
| `Method` | 成员方法 |
| `Modifier` | 修饰符工具类 |
| `Annotation` | 注解信息 |

## 三、获取 Class 对象的三种方式

```java
// 方式一：类名.class（最常用，编译时已知类名）
Class<?> clazz1 = Person.class;

// 方式二：对象.getClass()
Person p = new Person();
Class<?> clazz2 = p.getClass();

// 方式三：Class.forName("全限定类名")（最灵活，可从配置文件读取类名）
Class<?> clazz3 = Class.forName("com.example.Person");
```

三种方式获取的是**同一个 Class 对象**（单例）。

## 四、常见操作演示

### 4.1 获取构造方法并创建实例

```java
// 获取所有构造方法
Constructor<?>[] constructors = clazz.getDeclaredConstructors();

// 获取指定参数类型的构造方法
Constructor<?> c = clazz.getConstructor(String.class, int.class);

// 通过构造方法创建对象
Person p = (Person) c.newInstance("张三", 20);
```

### 4.2 获取并操作成员变量

```java
// 获取所有字段
Field[] fields = clazz.getDeclaredFields();

// 获取指定字段
Field nameField = clazz.getDeclaredField("name");

// 暴力反射——访问私有字段
nameField.setAccessible(true);
Object value = nameField.get(obj);  // 获取值
nameField.set(obj, "新值");         // 设置值
```

### 4.3 获取并调用方法

```java
// 获取所有方法
Method[] methods = clazz.getDeclaredMethods();

// 获取指定方法
Method method = clazz.getMethod("say", String.class);

// 调用方法
method.invoke(obj, "参数");
```

### 4.4 获取注解

```java
if (clazz.isAnnotationPresent(Info.class)) {
    Info info = clazz.getAnnotation(Info.class);
    System.out.println(info.value());
}
```

## 五、反射的优缺点

| 优点 | 缺点 |
|------|------|
| 运行时动态操作，灵活性强 | 性能较低（绕过了编译期优化） |
| 是很多框架的基础（Spring、MyBatis等） | 破坏封装性，可访问私有成员 |
| 实现通用的工具类 | 代码可读性下降 |

## 六、典型应用场景

1. **Spring 框架**：IoC 容器通过反射创建 Bean、依赖注入
2. **MyBatis**：通过反射将查询结果映射到 Java 对象
3. **JUnit**：通过反射调用带有 `@Test` 注解的方法
4. **IDE 自动提示**：通过反射获取类的方法列表
5. **动态代理**：JDK 动态代理基于反射实现

## 七、运行示例

编译并运行 `ReflectionDemo.java`：

```bash
javac ReflectionDemo.java
java ReflectionDemo
```

预期输出展示了 Class 对象获取、构造方法调用、字段访问、方法调用、注解读取等反射核心操作。
