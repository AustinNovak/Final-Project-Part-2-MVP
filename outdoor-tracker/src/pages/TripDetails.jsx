import { useParams } from "react-router-dom";

function TripDetails() {
  const { id } = useParams();

  return <h1>Trip Details for Trip #{id}</h1>;
}

export default TripDetails;