import request, { gql, GraphQLClient } from "graphql-request";
import { NextPage } from "next";

const client = new GraphQLClient("http://localhost:3000/api/graphql");

const EventPage: NextPage = async function EventPage({ params }) {
  const { slug } = await params;
  const data = await request(
    "http://localhost:3000/api/graphql",
    gql`
      query Event($where: EventWhereUniqueInput!) {
        event(where: $where) {
          id
          slug
          name
          date
          organiser {
            id
            name
          }
          venue {
            name
            url
          }
        }
      }
    `,
    { where: { slug } }
  );

  return (
    <div>
      <h2>{data?.event?.name}</h2>
      <p>
        {data.event.date ?? "TBC"} at {data.event.venue.name}
      </p>
    </div>
  );
};

export default EventPage;
