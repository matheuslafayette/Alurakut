import { SiteClient } from 'datocms-client';


export default async function recebedorDeRequests( request, response ){

    if( request.method === "POST"){

        const TOKEN = '3ad377ece53b24121d52878b6b16ef';
        const client = new SiteClient(TOKEN);
    
        const registroCriado = await client.items.create({
    
            itemType: "971909",
            ...request.body,
            
            //title: "Comunidade teste",
            //imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Icecat1-300x300.svg/1024px-Icecat1-300x300.svg.png"
        })
    
        response.json({
    
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })

        return;

    }

    response.status(404).json({

        message: 'Ainda nao temos nada no GET, mas no POST tem!'
    })
    

}