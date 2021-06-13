import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { UserOutlined, LockOutlined, MonitorOutlined } from "@ant-design/icons";
import md5 from "md5";

import { getCaptch, login, register } from "@/api/request";

import styles from "./index.module.less";

interface IFormValue {
  username: string;
  password: string;
  captcha: string;
  rePassword?: string;
}

const getValidatorRules = (isLogin: boolean, itemName: keyof IFormValue) => {
  let result;
  if (itemName === "username") {
    result = [{ required: true, message: "请输入用户名!" }];
    if (!isLogin) {
      result = [...result, { min: 5, message: "用户名长度不得小于5!" }];
    }
  } else if (itemName === "password") {
    result = [{ required: true, message: "请输入密码!" }];
    if (!isLogin) {
      result = [
        ...result,
        { min: 8, message: "密码长度不得小于8!" },
        {
          pattern: /^.*(?=.*\d)(?=.*[A-Z]{1,})(?=.*[a-z]{1,}).*$/,
          message: "密码必须同时含有数字和大小写字母",
        },
      ];
    }
  }
  return result;
};

const { useForm } = Form;

const Login = () => {
  const [form] = useForm();

  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [captchaSvg, setCaptchaSvg] = useState<string>("");

  const fetchCaptchaSvg = async () => {
    setCaptchaSvg(await getCaptch());
  };

  useEffect(() => {
    fetchCaptchaSvg();
  }, []);

  const toggleLoginStatus = () => {
    setIsLogin(!isLogin);
    form.resetFields();
    fetchCaptchaSvg();
  };

  const onFinish = async ({
    username,
    password,
    captcha,
    rePassword,
  }: IFormValue) => {
    if (isLogin) {
      try {
        const data = await login({
          username,
          password: md5(password),
          captcha,
        });
        Modal.success({
          content: data,
          onOk() {
            //TODO
          },
        });
      } catch (err) {
        Modal.error({ content: err });
      }
    } else {
      if (password !== rePassword) {
        Modal.error({ content: "两次密码输入不一致，请重试" });
        return;
      }
      try {
        const data = await register({
          username,
          password: md5(password),
          captcha,
        });
        Modal.success({
          content: data,
          onOk() {
            //TODO
          },
        });
      } catch (err) {
        Modal.error({ content: err });
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={getValidatorRules(isLogin, "username")}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={getValidatorRules(isLogin, "password")}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
        </Form.Item>
        {!isLogin && (
          <Form.Item name="rePassword">
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="确认密码"
            />
          </Form.Item>
        )}

        <div className={styles.captcha_container}>
          <Form.Item
            name="captcha"
            className={styles.captcha_input}
            rules={[{ required: true, message: "请输入验证码!" }]}
          >
            <Input prefix={<MonitorOutlined />} placeholder="验证码" />
          </Form.Item>

          <div
            onClick={fetchCaptchaSvg}
            className={styles.captcha_image}
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
          />
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.login_button}
          >
            {isLogin ? "登录" : "注册"}
          </Button>
          Or
          <span
            onClick={toggleLoginStatus}
            className={styles.toggle_login_text}
          >
            {isLogin ? "还没有注册" : "想要去登录"}
          </span>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
