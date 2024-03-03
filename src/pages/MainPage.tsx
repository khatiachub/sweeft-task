import axios from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../css/styled.css";
import {useQuery, useQueryClient} from "react-query";
import {usestoredData} from "../components/Context";
import ImageDetails from "../components/ImageDetails";

interface Image {
  id: number;
  urls: Urls;
}
interface Urls {
  small: string;
}
interface ApiResponse {
  results: any[];
  total: number;
  total_pages: number;
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
export default function MainPage() {
  const [keyValue, setKeyValue] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [dataArray, setDataArray] = useState<Image[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({} as Statistics);
  const [modalWindow, setModalWindow] = useState(false);
  const [filteredImage, setFilteredImage] = useState<Image[]>([]);
  const queryClient = useQueryClient();
  const {getData} = usestoredData();
  const allCachedQueries: readonly unknown[] = queryClient
    .getQueryCache()
    .findAll();
  getData(allCachedQueries as []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization:
            "Client-ID FAfkfh4tINXvU6ajMAjZp9XpBtvp0j_b7zH6VNtD4vs",
        };
        const res = await axios.get(
          `https://api.unsplash.com/photos?per_page=20`,
          {headers}
        );
        if (keyValue === "") {
          setDataArray(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!keyValue) {
      fetchData();
    }
  }, [keyValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyValue(e.target.value);
  };

  const handleClick = (id: number) => {
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
    setFilteredImage(dataArray.flat().filter((image) => image.id === id));
  };
  const closeWindow = () => {
    setModalWindow(false);
  };

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

  const headers = {
    Authorization: "Client-ID FAfkfh4tINXvU6ajMAjZp9XpBtvp0j_b7zH6VNtD4vs",
  };

  const fetchData = async (): Promise<ApiResponse> => {
    const res = await axios.get(
      `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${keyValue}&per_page=20`,
      {headers}
    );
    const data: ApiResponse = res.data;
    queryClient.setQueryData(["data", keyValue, pageNumber], data);
    return data;
  };

  const {data, isError} = useQuery<ApiResponse>({
    queryFn: () => fetchData(),
    queryKey: ["data", keyValue, pageNumber],
    staleTime: Infinity,
  });

  if (isError) {
    return <p>Error fetching data</p>;
  }

  useEffect(() => {
    if (keyValue !== "") {
      if (pageNumber === 1) {
        setDataArray(data?.results || []);
      } else {
        setDataArray((prevDataArray) => [
          ...prevDataArray,
          ...(data?.results || []),
        ]);
        setDataArray((prevDataArray) => prevDataArray.flat(1));
      }
    }
  }, [keyValue, data, isError, pageNumber]);

  return (
    <div>
      <div className="header-box">
        <input
          className="input"
          type="text"
          placeholder="შეიყვანეთ საძიებო სიტყვა"
          onChange={(e) => handleChange(e)}
        />
        <nav className="navigation">
          <Link className="nav-text" to={"/"}>
            მთავარი
          </Link>
          <Link className="nav-text" to={"/history"}>
            ისტორია
          </Link>
        </nav>
      </div>
      <div className="img-wraper">
        {dataArray &&
          dataArray.map((item) => (
            <img
              className="image"
              onClick={() => handleClick(item.id)}
              src={item?.urls?.small}
            />
          ))}
      </div>
      <ImageDetails
        modalWindow={modalWindow}
        statistics={statistics}
        closeWindow={closeWindow}
        filteredImage={filteredImage}
      />
    </div>
  );
}
