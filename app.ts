import amqplib from "amqplib/callback_api";

amqplib.connect("amqp://18.209.192.241/", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = "log";

    channel.assertQueue(queue, {
      durable: true,
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      async function (msg : any) {
        console.log(" [x] Received %s", msg.content.toString());
        try {
          const headers = {
            "Content-Type": "application/json",
          };
          const req = {
            method: "POST",
            body: msg.content.toString(),
            headers,
          };
          const result = await fetch(
            "http://localhost:3000/api/logs",
            req
          );
          const data = await result.json();
          console.log(data);
          console.log(JSON.parse(msg.content.toString()));
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      {
        noAck: true,
      }
    );
  });
});
