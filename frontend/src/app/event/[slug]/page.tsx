import { DocumentRenderer } from "@keystone-6/document-renderer";
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
          description {
            document
          }
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
      <h2 className="text-2xl text-center">{data?.event?.name}</h2>
      <h3 className="text-3xl">
        {data.event.date ?? "TBC"} at {data.event.venue.name}
      </h3>
      <div>
        <DocumentRenderer document={data.event.description.document} />
      </div>
    </div>
  );
};

export default EventPage;
