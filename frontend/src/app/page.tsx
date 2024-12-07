import request, { gql } from "graphql-request";
import Link from "next/link";

export default async function Home() {
  const response = await request(
    "http://localhost:3000/api/graphql",
    gql`
      query GetEvents {
        events {
          id
          name
          date
          slug
          venue {
            name
          }
        }
      }
    `
  );
  return (
    <div className="">
      <main className="">
        <h2 className="text-2xl text-center">The front page</h2>
        <h3 className="text-xl">Events</h3>
        <table>
          <thead>
            <tr>
              <th className="text-left">Date</th>
              <th className="text-left">Name</th>
              <th className="text-left">Venue</th>
            </tr>
          </thead>
          <tbody>
            {response.events.map((event) => (
              <tr key={event.slug}>
                <td className="m-4 text-left">{event.date ?? "TBC"}</td>
                <td className="m-4 text-left">
                  <Link className="link" href={`/event/${event.slug}`}>
                    {event.name}
                  </Link>
                </td>
                <td className="m-4 text-left">{event.venue.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Boring Legal Stuff
      </footer>
    </div>
  );
}
