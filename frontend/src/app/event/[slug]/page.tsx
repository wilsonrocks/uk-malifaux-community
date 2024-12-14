import { graphQlClient } from "@/lib/graphql-client";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { gql } from "graphql-request";
import { NextPage } from "next";

const EventPage: NextPage = async function EventPage({ params }) {
  const { slug } = await params;
  const data = await graphQlClient.request(
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
