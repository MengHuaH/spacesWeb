import { Inter } from 'next/font/google'
import mqtt from 'mqtt';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

var reconnectNum = 0;//重连次数
var mqtt_url = "ws://101.33.233.99/mqtt";
var opts = { username: "admin", password: "mhh1112", port: 8083,  }

export default function Home() {

  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null)
  const connectMqtt = () => {

    client.publish('esp32/test', "1", { qos: 0 }, () => {//消息发布
      console.log("音频消息发布")
    });

  }

  useEffect(() => {
    const client = mqtt.connect(mqtt_url, opts);
    setClient(client)
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('esp32/test'); // 替换为你的主题
    });
 
    client.on('message', (topic, message) => {
      // 收到消息后更新组件状态
      setMessage(message.toString());
      console.log(message.toString())
    });
 
    return () => {
      // 组件卸载时断开连接
      client.end();
    };
  }, []);

  return (
    <>
      <div>123</div>
      <button onClick={connectMqtt}>dddd</button>
    </>
  )
}
