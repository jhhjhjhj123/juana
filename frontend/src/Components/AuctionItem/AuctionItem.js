import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function AuctionItem({ id, title, imageUrl, endDate, currentBid }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [auctionEnded, setAuctionEnded] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const duration = (new Date(endDate) - new Date()) / 1000;
      if (duration <= 0) {
        setTimeLeft(`0d 0h 0m 0s`);
        setAuctionEnded(true);
      } else {
        const days = Math.floor(duration / (24 * 3600));
        const hours = Math.floor((duration % (24 * 3600)) / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [endDate]);

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden" key={id}>
      <Helmet>
        <title>Auction House-EcomBidding</title>
      </Helmet>
      <img
        src={imageUrl}
        alt="ItemImage"
        className="w-full h-48 object-contain hover:scale-105 duration-500"
      />
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">Current Bid: ₹{currentBid}</p>
        <p className="text-gray-600">
          Time Left: <span className="font-bold">{timeLeft}</span>
        </p>
        {auctionEnded ? (
          <button
            className="w-full py-2 px-4 cursor-not-allowed bg-gray-100 text-gray-400 duration-200 rounded-md mt-4"
            disabled
          >
            Auction Ended
          </button>
        ) : (
          <Link to={`/auctions/${id}`}>
            <button className="w-full py-2 px-4 bg-gray-300 text-gray-600 duration-200 rounded-md mt-4 hover:bg-gray-400">
              Bid Now
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default AuctionItem;