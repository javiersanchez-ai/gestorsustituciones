export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    console.log("Datos recibidos:", data);

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    if (!isValidEmail(data.to)) {
      return new Response(JSON.stringify({ error: "Email destinatario no válido" }), { status: 400 });
    }
    if (!data.subject || !data.text) {
      return new Response(JSON.stringify({ error: "Faltan asunto o texto del correo" }), { status: 400 });
    }

    const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      console.error("API Key de SendGrid no configurada.");
      return new Response(JSON.stringify({ error: "API Key de SendGrid no configurada." }), { status: 500 });
    }

    const fromEmail = 'javier.sanchez@salesianosciudadreal.com';

    // Solo esta línea para send_at:
    const sendAt = data.sendAt ? Math.floor(new Date(data.sendAt).getTime() / 1000) : undefined;

    const msg = {
      personalizations: [{ to: [{ email: data.to }] }],
      from: { email: fromEmail, name: 'Gestor de Sustituciones' },
      subject: data.subject,
      content: [{ type: 'text/plain', value: data.text }],
      ...(sendAt && { send_at: sendAt })
    };

    console.log("Mensaje construido:", msg);

    // ENVÍO A SENDGRID
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msg),
    });

    // MOSTRAR STATUS CODE
    console.log("Status de SendGrid:", response.status);

    // También puedes mostrar el statusText para más info
    console.log("StatusText de SendGrid:", response.statusText);

    if (response.status >= 200 && response.status < 300) {
      return new Response(JSON.stringify({ message: "Correo enviado con éxito" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Extra: muestra los headers y el cuerpo del error
      console.log("Headers de SendGrid:", JSON.stringify([...response.headers]));
      const errorBody = await response.text();
      console.error("Error desde SendGrid:", errorBody);
      return new Response(JSON.stringify({ 
        error: "Hubo un error al contactar con el servicio de correo.",
        details: errorBody,
        status: response.status,
        statusText: response.statusText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    // Si hay un error en nuestra propia función, lo mostramos
    console.error("Error en la función de Cloudflare:", error);
    return new Response(JSON.stringify({ error: "Hubo un error interno en la función." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
  }
}