const ProposalCard = ({ proposal, onAccept }) => {
  return (
    <div className="border p-4 rounded mt-3">
      <h4 className="font-semibold">
        {proposal.freelancer?.name || "Freelancer"}
      </h4>

      <p className="text-gray-600 mt-1">
        {proposal.coverLetter}
      </p>

      <p className="mt-1">Bid: ₹{proposal.bidAmount}</p>
      <p>Delivery: {proposal.deliveryTime} days</p>

      {proposal.status === "pending" && onAccept && (
        <button
          onClick={() => onAccept(proposal._id)}
          className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
        >
          Accept Proposal
        </button>
      )}

      {proposal.status === "accepted" && (
        <p className="text-green-600 font-bold mt-2">
          Accepted
        </p>
      )}
    </div>
  );
};

export default ProposalCard;
