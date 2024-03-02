
interface PropsType{
    modalWindow:boolean,
    statistics:{
        downloads:{
            total:number
        },
        likes:{
            total:number
        },
        views:{
            total:number
        }
    },
    closeWindow:()=>void,
    filteredImage:any[]
}

export default function ImageDetails(props:PropsType) {
    
  return (
    <div>
        {props.modalWindow && props.statistics && (
<div className='overlay'>
  <div className='image-container'>
    <div className='image-wraper'>
    {props.filteredImage&&props.filteredImage.map((item)=>(
        <img  className='full-image'  src={item?.urls?.regular}/>
      ))}
    </div>
    <div className='list'>
    <h3 className='list-text'>მოწონებების რაოდენობა: {props.statistics.likes?.total}</h3>
    <h3 className='list-text'>გადმოწერების რაოდენობა: {props.statistics.downloads?.total}</h3>
    <h3 className='list-text'>ნახვების რაოდენობა: {props.statistics.views?.total}</h3>
    <i onClick={props.closeWindow} className="fa-solid fa-xmark close-button"></i>
    </div>
  </div>
  </div>
)}
    </div>
  )
}
