import { graphQlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";
import { NextPage } from "next";
import Link from "next/link";

const ResourcesPage: NextPage = async () => {
  const data = await graphQlClient.request(gql`
    query Resources {
      resources {
        name
        id
        description
        content {
          document
        }
        slug
        author {
          name
        }
      }
    }
  `);
  return (
    <div>
      <h2>Resources</h2>
      <table>
        <thead>
          <tr>
            <th>Resource</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.resources.map((resource) => (
            <tr key={resource.id}>
              <td>
                <Link href={`/resource/${resource.slug}`}>{resource.name}</Link>
              </td>
              <td>{resource.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesPage;
