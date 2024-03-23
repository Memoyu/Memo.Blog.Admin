import React, { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import { IconRating } from '@douyinfe/semi-icons-lab';
import { Form, Row, Col, Button, Space } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import Content from '@src/components/page-content';

import './index.scss';
import 'md-editor-rt/lib/style.css';

const { Section, Input, TagInput } = Form;

const Index: React.FC = () => {
    const toolbars: Array<any> = [
        'bold',
        'underline',
        'italic',
        '-',
        'strikeThrough',
        'sub',
        'sup',
        'quote',
        'unorderedList',
        'orderedList',
        'task',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        '-',
        'revoke',
        'next',
        'save',
        '=',
        'pageFullscreen',
        'fullscreen',
        'preview',
        'htmlPreview',
        'catalog',
    ];

    const [content, setContent] = useState(
        '本文叙述的问题的根源在于对C#基础知识掌握不牢固，从而在遇到难以理解的问题时浪费了大量时间；\n在此也警示自己，该啃啃基础书籍了！\n话不多说，先上代码：\n## 先看问题\n```csharp\nservices.AddEasyCaching(option =>\n{\n    option.UseHybrid(config =>\n    {\n        .....\n    })\n    .WithZookeeeperBus(busConf =>\n    {\n        // 方式1\n        busConf.ConnectionString = "192.168.3.86:2181";\n        // 方式2\n        busConf = new ZkBusOptions\n        {\n            ConnectionString = "192.168.3.86:2181",\n        };\n    });\n});\n```\n这是我在使用`EasyCaching`时的一段注册代码，在配置`Zookeeeper Bus`时调用了`WithZookeeeperBus(Action<ZkBusOptions>)`拓展方法，并采用了如上两种赋值方式，看似都能正常配置，但实际不尽人意：\n**方式1：**配置正常；\n**方式2：**配置无效，最终`ConnectionString=null`；\n\nwhat？肯定是编译器问题！( 确信\n此时我的心情极其复杂，这两种赋值不是一样的？\n![](https://img2023.cnblogs.com/blog/1667295/202302/1667295-20230217174726473-916435626.jpg)\n\n## 问题在哪？\n一开始，我甚至怀疑是自己对`Action<T>`的理解不到位，存在某种机制导致的问题，但事实证明，饭可以乱吃，锅不能乱甩；\n每每想起这，不由得老脸一红！\n### 问题在这\n实则问题是在最基础的**方法传参**问题；\n咱们可以先理解一下方法传参存在哪几种情况，以及情况对应传参方式；\n**在C#参数传递分为如下四种：**\n> - 值类型的值传递（将值类型的副本传递给方法）\n> - 值类型的引用传递（将值类型本身传递给方法，例如：使用了`ref int a`）\n> - 引用类型的值传递（将引用的副本传递给方法 ）   \n> - 引用类型的引用传递（将引用本身传递给方法，例如：使用了`ref object o`）\n\n**此时，如果你已经悟了，那文章到此结束，还一知半解的，请继续往下看；**\n### 再细一点\n先看看如下代码：\n```csharp\nvoid Main()\n{\n\tvar p = new Person { Name = "jason", Age = 19 };\n    // 赋值方法 1\n\tAssignmentPerson_1(p);\n    Console.WriteLine($"Name: {p.Name}; Age: {p.Age}");\n\n    // 赋值方法 2\n    AssignmentPerson_2(p);\n\tConsole.WriteLine($"Name: {p.Name}; Age: {p.Age}");\n}\n\npublic void AssignmentPerson_1(Person t)\n{\n\tvar np = new Person { Name = "jack", Age = 18 };\n\tt = np;\n}\n\npublic void AssignmentPerson_2(Person t)\n{\n\tvar np = new Person { Name = "jack", Age = 18 };\n\tt.Name = np.Name;\n\tt.Age = np.Age;\n}\n\npublic class Person\n{\t\n\tpublic string Name { get; set; }\n\t\n\tpublic int Age { get; set; }\n}\n```\n很显然，在本文起始的教训下，答案是明显，会输出如下：\n`Name = "jason"; Age = 19`\n`Name = "jack"; Age = 18`\n\n首先，在main中创建了`p`，假设`p`在栈中的地址为`0x0001`，栈值为指向堆中实例的地址`0x00D1`；\n![](https://img2023.cnblogs.com/blog/1667295/202302/1667295-20230217174754634-102901266.png)\n\n#### 赋值方法-1\n然后，开始调用`AssignmentPerson_1(Person t)`，并传入`p`；\n**此时，不是直接将 `p`(栈地址:`0x0001`)传入方法，而是拷贝了一份`p`(栈地址:`0x0005`)，并且同时将栈值赋为`0x00D1`，传入方法中；**\n所以，`AssignmentPerson_1(Person t)`中`t`的地址为`0x0005`；\n![](https://img2023.cnblogs.com/blog/1667295/202302/1667295-20230217174817337-987292454.png)\n\n最后，新建`np`，栈地址为`0x000A`，栈值为指向堆中实例的地址`0x00D5`；\n并将`t = np`，`t`的栈值被替换了`0x00D1` -> `0x00D5`；\n![](https://img2023.cnblogs.com/blog/1667295/202302/1667295-20230217174858594-1617327277.png)\n\n**最终，`p`的栈值还是`0x00D1`，并且`0x00D1`中的堆值也并未发生变化，所以赋值无效；**\n#### 赋值方法-2\n同理，当调用`AssignmentPerson_2(Person t)`时，同样传入`p`，同样新建`np`；\n但是，并没有替换`t`的栈值，它仍旧与`p`指向的堆地址相同，为`0x00D1`;\n此时赋值操作只是替换了堆值中实例的属性值：`t.Name = np.Name`，`t.Age = np.Age`；\n![](https://img2023.cnblogs.com/blog/1667295/202302/1667295-20230217174920272-1659194228.png)\n\n**所以，`t`指向的堆值发生了变化， `t`与`p`又指向地址相同，`p`的实例属性值也就发生了变化；**\n## 总结\n该读一本《CLR via》了！\n\n## 参考\n[1-关于C#函数对象参数传递的问题](https://www.cnblogs.com/qguohog/archive/2009/12/26/1632967.html)\n[2-彻底澄清：C#方法参数](https://www.cnblogs.com/freeflying/archive/2009/12/27/1633101.html)\n'
    );

    return (
        <Content title="关于信息" icon={<IconRating />}>
            <div className="about-container">
                <Form style={{ padding: 10, width: '100%' }} onValueChange={(v) => console.log(v)}>
                    <Section text={'基本信息'}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Input
                                    field="name"
                                    label="标题"
                                    initValue={'mikeya'}
                                    trigger="blur"
                                />
                            </Col>
                            <Col span={8}>
                                <TagInput field="tags" label="标签" placeholder="请输个人标签" />
                            </Col>
                            <Col span={4}>
                                <Form.Upload
                                    field="files"
                                    label="头图"
                                    action="//semi.design/api/upload"
                                >
                                    <Button icon={<IconUpload />} theme="light">
                                        文章头图
                                    </Button>
                                </Form.Upload>
                            </Col>
                        </Row>
                    </Section>
                </Form>
                <Section className="content-editer" text={'简介内容'}>
                    <MdEditor
                        style={{ height: 800 }}
                        modelValue={content}
                        toolbars={toolbars}
                        onChange={setContent}
                    />
                </Section>
                <Space style={{ margin: 20, width: '100%', justifyContent: 'center' }}>
                    <Button
                        type="primary"
                        theme="solid"
                        style={{ width: 120, marginTop: 12, marginRight: 4 }}
                    >
                        保存
                    </Button>
                </Space>
            </div>
        </Content>
    );
};

export default Index;
