import React, { useContext, useEffect, useReducer } from 'react';
import AuctionItem from '../../Components/AuctionItem/AuctionItem';
import Loading from '../../Components/Loading/Loading';
import ErrorPage from '../../Components/ErrorPage/ErrorPage';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';

const initialState = {
  products: [],
  loading: true,
  error: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function AuctionPage() {
  const [{ loading, error, products }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const {
    state: { userInfo },
  } = useContext(Store);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const response = await fetch('/api/auctions'); // replace with your API endpoint
        const data = await response.json();
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100">
      <header className="bg-cyan-500 py-4 shadow-sm">
        <div className="container mx-auto flex items-center">
          <div className="flex-grow flex justify-center ml-36">
            <h1 className="text-3xl font-bold text-white mx-auto">
              <i className="fas fa-hourglass-half text-2xl mr-2"></i>
              Live Auction
            </h1>
          </div>
          <div className="flex justify-end">
            {userInfo && userInfo.isSeller && (
              <Link
                to="/create-auction"
                className="bg-white hover:bg-gray-200 hover:text-cyan-600 duration-200 sm:mr-2 text-cyan-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Auction
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorPage />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <AuctionItem
                key={product._id}
                id={product._id}
                title={product.title}
                imageUrl={product.imageUrl}
                endDate={product.endDate}
                currentBid={product.currentBid}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-2">No auctions found!</h2>
            <p className="text-gray-500">
              Please check back later for more auctions.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AuctionPage;