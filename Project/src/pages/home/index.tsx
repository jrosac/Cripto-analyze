import styles from "./home.module.css"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"
import { useState,useEffect ,type FormEvent } from "react"

interface CoinProps{
  id : string;
  name : string;
  symbol: string;
  priceUsd : string;
  vwap24Hr : string;
  changePercent24Hr: string;
  rank : string;
  supply : string;
  maxSuply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string; 
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProps{
  data: CoinProps[];

}




export function Home() {
   const [input,setInput] = useState("")
   const navigate = useNavigate();
   const [coins,setCoins] = useState<CoinProps[]>([])

   useEffect(()=>{
    getData();

   },[])


   async function getData(){
    fetch("https://rest.coincap.io/v3/assets?limit=10&offset=0&apiKey=698131165c43be13732afe846f361e0f24a16cc82be3a87e6a1d8873e652d675")
    .then(response => response.json())
    .then((data: DataProps)=>{
      
      const coinsData = data.data;
      
      const price = Intl.NumberFormat("en-US",{
        style:"currency",
        currency:"USD"
      })

      const priceCompact = Intl.NumberFormat("en-US",{
        style:"currency",
        currency:"USD",
        notation:"compact"
      })

      const formatedResult = coinsData.map((item)=>{
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
          }
        return formated;
      })

      //console.log(formatedResult)
      setCoins(formatedResult)
    
    })
   
  }



   function handleSubmit(e : FormEvent){
    e.preventDefault();

    if(input === "")
      return;

    navigate(`/detail/${input}`)

   }

   function handleGetMore(){
    
   }


    
    return (
      <main className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
          type="text" 
          placeholder="Search for the coin... EX: bitcoin "
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          />
          <button type="submit">
            <BsSearch size={30} color="#FFF"/>
          </button>

        </form>


        <table>
          <thead>
            <tr>
              <th scope="col">Moeda</th>
              <th scope="col">Valor Mercado</th>
              <th scope="col">Preço</th>
              <th scope="col">Volume</th>
              <th scope="col">Mudança 24h</th>
            </tr>
          </thead>

          <tbody id="tbody">

            {coins.length > 0 && coins.map((item)=>(
              <tr className={styles.tr} key={item.id}>
  
              <td className={styles.tdLabel} data-label="moeda">
                
                <div className={styles.name}>
                  <img 
                  className={styles.logo}
                  src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}  
                  alt="Logo-cripto" />
                <Link to={`/detail/${item.id}`}>
                <span>{item.name}</span> | {item.symbol}
                </Link>
                </div>
              </td>

              <td className={styles.tdLabel} data-label="Valor mercado">
                {item.formatedMarket }
              </td>


              <td className={styles.tdLabel} data-label="Preco">
                {item.formatedPrice}
              </td>

              <td className={styles.tdLabel} data-label="Volume">
                {item.formatedVolume}
              </td>

              <td className={Number(item.changePercent24Hr) > 0? styles.tdProfit : styles.tdLoss} data-label="Mundança 24h">
                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
              </td>


                </tr>
            ))}

          </tbody>
        </table>

        <button className={styles.buttonMore} onClick={handleGetMore}>
          Carregar mais 
        </button>





      </main>
    )
  }
  
  