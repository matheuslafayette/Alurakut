import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet, ProfileFollowersBox, ProfileCommunitiesBox, ProfilePeopleBox } from '../src/lib/aluraCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar( proprieades ){

  return(

    <Box as = 'aside'>
      <img src = {`https://github.com/${proprieades.githubUser}.png`} style = {{ borderRadius: '8px' }}/>
      <hr/>

      <p>
        <a className = "boxLink" href={`https://github.com/${proprieades.githubUser}`}>

          @{proprieades.githubUser}
        </a>
      </p> 
      <hr/>

      <AlurakutProfileSidebarMenuDefault/>

    </Box>
  )
}

export default function Home( props ) {

  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);

  const pessoasFavoritas = [
    {
      name: 'omariosouto',
      id: '4234'
    },
    {
      name: 'peas',
      id: '42344'
    },
    {
      name: 'rafaballerini',
      id: '42345'
    },
    {
      name: 'marcobrunodev',
      id: '42634'
    },
    {
      name: 'juunegreiros',
      id: '42734'
    },
        {
      name: 'felipefialho',
      id: '48234'
    },
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect( function(){

    //GET
    const seguidores = fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then( function( respostaServidor ){

      return respostaServidor.json();
    })
    .then( function( respostaCompleta ) {

      setSeguidores( respostaCompleta );
    })

    //API GraphQL
    fetch( 'https://graphql.datocms.com/', {

      method: 'POST',
      headers: {

        'Authorization': '50c58713174b3eaba2c3c2813c6ac5',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query{
        allCommunities {
          title
          id
          imageUrl
        }
      }` })
    })
    .then( (response) => response.json() ) //pega o retorno do response.json() e já retorna
    .then( (respostaCompleta) => {

      const comunidadesDato = respostaCompleta.data.allCommunities;
      setComunidades( comunidadesDato );
    })

  }, [])

  return (

    <>
      <AlurakutMenu githubUser = {githubUser}/>

      <MainGrid>

        <div className = "profileArea" style = { { gridArea: 'profileArea' } }>
          <ProfileSidebar githubUser = {githubUser}/>
        </div>

        <div className = "welcomeArea" style = { { gridArea: 'welcomeArea' } }>

          <Box>

            <h1 className = "title" >Bem vindo(a)</h1>
            <OrkutNostalgicIconSet/>
            
          </Box> 

          <Box>

            <h2 className = "subTitle" >O que você deseja fazer?</h2>
            <form onSubmit = { function handleCriaComunidade( e ){

              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {

                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
              }

              fetch('/api/comunidades', {

                method: 'POST',
                headers: {

                  'Content-Type': 'application/json'
                },
                body: JSON.stringify( comunidade )
              })
              .then(async (response) => {

                const dados = await response.json();
                const comunidade = dados.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades( comunidadesAtualizadas );
              })


            
            } } >

              <div>

                <input 
                placeholder = "Qual vai ser o nome da sua comunidade?" 
                name = "title" 
                aria-label = "Qual vai ser o nome da sua comunidade?"
                type = "text"
                />

              </div>
              <div>

                <input 
                placeholder = "Coloque uma URL para usarmos de capa" 
                name = "image" 
                aria-label = "Coloque uma URL para usarmos de capa"
                type = "text"
                />

              </div>

              <button>
                Criar comunidade
              </button>

            </form>

          </Box>

        </div>

        <div className = "profileRelationsArea" style = { { gridArea: 'profileRelationsArea' } }>

          <ProfileFollowersBox title = "Seguidores" items = {seguidores} />

          <ProfileCommunitiesBox title = "Comunidades" items = {comunidades} />

          <ProfilePeopleBox title = "Pessoas da comunidade" items = {pessoasFavoritas} />

        </div>
    

      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {

  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {

    headers: {
      Authorization: token
    }
  })
  .then( (resposta) => resposta.json())

  if(!isAuthenticated){

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const {githubUser} = jwt.decode(token);

  return {
    props: {
      githubUser
    }, // will be passed to the pa ge component as props
  }
}
