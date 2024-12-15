import { graphQlClient } from "@/lib/graphql-client";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { gql } from "graphql-request";
import { NextPage } from "next";
import { notFound } from "next/navigation";

const ResourcePage: NextPage = async function ResourcePage({ params }) {
  const { slug } = await params;
  const data = await graphQlClient.request(
    gql`
      query Resource($where: ResourceWhereUniqueInput!) {
        resource(where: $where) {
          name
          id
          description
          content {
            document
          }
          author {
            name
          }
        }
      }
    `,
    { where: { slug } }
  );

  if (!data) notFound();

  return (
    <div>
      <h2 className="text-2xl text-center">{data?.team?.name}</h2>

      <div>
        {/* <DocumentRenderer document={data.resource?.content.document} /> */}
      </div>
    </div>
  );
};

export default ResourcePage;
