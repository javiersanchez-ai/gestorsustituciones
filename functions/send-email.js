// La estructura del archivo de función para Cloudflare Pages
// El nombre del archivo se convierte en la ruta, ej: /send-email

export async function onRequestPost(context) {
  try {
    // Obtenemos los datos enviados desde la aplicación
    const data = await context.request.json();
    // Obtenemos la llave secreta de las variables de entorno de Cloudflare
    const SENDGRID_API_KEY = context.env.SENDGRID_API_KEY;

    // Dirección desde la que se enviarán los correos.
    // DEBE SER LA MISMA que verificaste como "Single Sender" en SendGrid.
    const fromEmail = 'javier.sanchez@salesianosciudadreal.com';

    // Construimos el mensaje para SendGrid
    const msg = {
      personalizations: [{ to: [{ email: data.to }] }],
      from: { email: fromEmail, name: 'Gestor de Sustituciones' },
      subject: data.subject,
      content: [{ type: 'text/plain', value: data.text }],
      // Si nos pasan la propiedad 'sendAt', programamos el correo
      ...(data.sendAt && { send_at: data.sendAt })
    };

    // Hacemos la llamada a la API de SendGrid para enviar el correo
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msg),
    });

    // Comprobamos si SendGrid aceptó el correo
    if (response.status >= 200 && response.status < 300) {
      return new Response(JSON.stringify({ message: "Correo enviado con éxito" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Si SendGrid da un error, lo mostramos en los logs de Cloudflare
      const errorBody = await response.text();
      console.error("Error desde SendGrid:", errorBody);
      return new Response(JSON.stringify({ error: "Hubo un error al contactar con el servicio de correo." }), {
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

