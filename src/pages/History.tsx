import {Link} from "react-router-dom";
import {usestoredData} from "../components/Context";
import {useEffect, useMemo, useState} from "react";
import ImageDetails from "../components/ImageDetails";
import axios from "axios";

interface DataType {
  queryKey: any[];
}
interface Image {
  id: number;
  urls: {
    small: string;
  };
}
interface Results {
  results: Image[];
}
interface Item {
  state: {
    data: Results;
  };
}
interface Statistics {
  downloads: {
    total: number;
  };
  likes: {
    total: number;
  };
  views: {
    total: number;
  };
}
export default function History() {
  const {storeData} = usestoredData();
  const [open, setOpen] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const [statistics, setStatistics] = useState<Statistics>({} as Statistics);
  const [modalWindow, setModalWindow] = useState(false);
  const [filteredImage, setFilteredImage] = useState<any[]>([]);
  const [dataArray, setDataArray] = useState<readonly unknown[]>([]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchData = () => {
    const data =
      storeData &&
      storeData.find(
        (item: DataType) =>
          item.queryKey[2] === pageNumber && item.queryKey[1] === open
      );
    if (pageNumber > 1) {
      setDataArray((prevDataArray) => [...prevDataArray, data].filter(Boolean));
    } else {
      setDataArray([data].filter(Boolean));
    }
  };

  const handleClick = (name: string) => {
    setDataArray([]);
    setOpen("");
    setPageNumber(1);
    setOpen(name);
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber, open]);

  function getUniqueCompleteWords(words: any[] | undefined) {
    const uniqueWords = new Set(words);
    const completeWords = Array.from(uniqueWords).filter((word, index, arr) => {
      const restOfWords = arr.slice(0, index).concat(arr.slice(index + 1));
      return restOfWords.every((otherWord) => !otherWord.includes(word));
    });
    return completeWords;
  }
  const maxword =
    storeData && storeData.map((item: DataType) => item.queryKey[1]);
  const filteredMaxWord: any[] | undefined = maxword?.filter(
    (word) => word !== ""
  );
  const uniqueWord = useMemo(
    () => getUniqueCompleteWords(filteredMaxWord),
    [filteredMaxWord]
  );

  const clickImage = (id: number) => {
    const fetchStatData = async () => {
      try {
        const headers = {
          Authorization:
            "Client-ID FAfkfh4tINXvU6ajMAjZp9XpBtvp0j_b7zH6VNtD4vs",
        };
        const res = await axios.get(
          `https://api.unsplash.com/photos/${id}/statistics`,
          {headers}
        );
        setStatistics(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStatData();
    setModalWindow(true);
    const filteredData =
      dataArray &&
      dataArray
        .map((item) => (item as Item)?.state?.data?.results)
        .map((item) => item.filter((image) => image.id === id));
    setFilteredImage(filteredData.flat());
  };
  const closeWindow = () => {
    setModalWindow(false);
  };


  return (
    <div>
      <nav className="navigation-history">
        <Link className="nav-text" to={"/sweeft-task/"}>
          მთავარი
        </Link>
        <Link style={{marginLeft: 20}} className="nav-text" to={"/sweeft-task/history"}>
          ისტორია
        </Link>
      </nav>
      <ul className="list-history">
        {uniqueWord.map((item) => (
          <li key={item} className="list-item" onClick={() => handleClick(item)}>
            {item}
          </li>
        ))}
      </ul>

      <div className="img-wraper">
        {dataArray &&
          dataArray.map((item) =>
            (item as Item)?.state.data.results.map((image) => (
              <img
                key={image.id}
                className="image"
                onClick={() => clickImage(image.id)}
                src={image?.urls?.small}
              />
            ))
          )}
      </div>
      <ImageDetails
        modalWindow={modalWindow}
        statistics={statistics}
        closeWindow={closeWindow}
        filteredImage={filteredImage}
      />
      {filteredMaxWord?.length === 0 && (
        <h2 className="history-title">ისტორია არ მოიძებნა!</h2>
      )}
    </div>
  );
}
