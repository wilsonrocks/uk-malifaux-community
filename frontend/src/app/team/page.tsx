import { graphQlClient } from "@/lib/graphql-client";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import { gql } from "graphql-request";
import { NextPage } from "next";
import Link from "next/link";

const ResourcesPage: NextPage = async () => {
  const data = await graphQlClient.request(gql`
    query Teams {
      teams {
        slug
        name
        members {
          document
        }
        logo {
          publicUrl
        }
        location
        id
        facebook
        email
        discord
        captain {
          name
          discordUsername
          publicEmail
        }
        description {
          document
        }
      }
    }
  `);
  return (
    <div>
      <h2>Teams</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Location</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.teams.map((team) => (
            <tr key={team.id}>
              <td>
                <Link href={`/team/${team.slug}`}>{team.name}</Link>
              </td>
              <td>{team.location}</td>
              <td>
                <DocumentRenderer document={team.description.document} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesPage;
