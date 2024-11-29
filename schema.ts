// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { group, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  calendarDay,
  decimal,
  float,
  checkbox,
} from "@keystone-6/core/fields";

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document";
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import { type Lists } from ".keystone/types";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { cloudinaryConfig } from "./config";

const isNotLevel =
  (levelString: string) =>
  (
    levelString: string // TODO pull this out of the options enum
  ) =>
  ({ session }: any) =>
    session.data.level !== levelString;

const isLevel =
  (
    levelString: string // TODO pull this out of the options enum
  ) =>
  ({ session }: any) =>
    session.data.level === levelString;

const isMasterOrSameUser = ({ session }: any): boolean => {
  const {
    itemId,
    data: { id },
  } = session;
  return isLevel("MASTER")({ session }) || session.itemId === session.data.id;
};

export const lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: {
      operation: {
        create: isLevel("MASTER"),
        update: isMasterOrSameUser,
        delete: isLevel("MASTER"),
        query: () => true,
      },
      filter: {
        query: ({ session, context }: any) => {
          if (session.data.level === "MASTER") return {};
          return { id: { equals: session.data.id } };
        },
      },
    },

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),
      level: select({
        type: "enum",
        options: [
          { value: "MASTER", label: "Master" },
          { value: "HENCHMAN", label: "Henchman" },
          { value: "ENFORCER", label: "Enforcer" },
        ],
        defaultValue: "HENCHMAN",
        db: { isNullable: false },
        validation: { isRequired: true },
        access: {
          read: isLevel("MASTER"),
          update: isLevel("MASTER"),
          create: ({ session, context }) => {
            return isLevel("MASTER")({ session });
          },
        },
        ui: {
          createView: {
            fieldMode: ({ session }: any) => {
              if (isLevel("MASTER")({ session })) return "edit";
              return "hidden";
            },
          },
          itemView: {
            fieldMode: ({ session }: any) => {
              if (isLevel("MASTER")({ session })) return "edit";
              return "hidden";
            },
          },
        },
      }),
      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
        ui: {
          description:
            "This is not public, it's just used to login to this site",
        },
      }),

      password: password({ validation: { isRequired: true } }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),

      ...group({
        label: "Public Contact Info",
        description:
          "This will be added as contact info on any events you create. It's recommended to add at least one way of contacting you!",
        fields: {
          discordUsername: text({
            ui: {
              description: "Your username on the UK Malifaux Discord Server",
            },
          }),
          publicEmail: text({}),
        },
      }),

      events: relationship({
        ref: "Event.organiser",
        many: true,
        ui: { itemView: { fieldMode: "hidden" } },
      }),
    },
  }),

  Event: list({
    access: {
      operation: {
        create: isLevel("MASTER"),
        update: isMasterOrSameUser,
        delete: isLevel("MASTER"),
        query: () => true,
      },
      filter: {
        query: ({ session, context: { query } }: any) => {
          if (session.data.level === "MASTER") return {};
          return { organiser: { id: { equals: session.data.id } } };
        },
      },
    },
    hooks: {
      // Automatically set the logged-in user as the author on create
      resolveInput: async ({ resolvedData, context, operation }) => {
        if (operation === "create") {
          return {
            ...resolvedData,
            organiser: { connect: { id: context.session?.data.id } },
          };
        }
        return resolvedData;
      },
    },
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
      level: select({
        options: [
          { label: "Standard", value: "STANDARD" },
          { label: "GT", value: "GT" },
          { label: "Nationals", value: "NATIONALS" },
        ],
        validation: { isRequired: true },
        defaultValue: "STANDARD",
      }),
      organiser: relationship({
        ref: "User.events",
        many: false,
        ui: {
          hideCreate: true,
          itemView: { fieldMode: "hidden" },
          createView: { fieldMode: "hidden" },
          listView: {
            fieldMode: ({ session }) => {
              if (isLevel("MASTER")({ session })) return "read";
              return "hidden";
            },
          },
        },
      }),
      venueName: text(),
      description: document(),
      date: calendarDay({
        isIndexed: true,
        ui: { description: 'Will show "tbc" if left blank' },
      }),
      cost: float({
        validation: { min: 0 },
        ui: { description: 'Will show "tbc" if left blank' },
      }),
      howToPay: document({ formatting: true }),
      swagDescription: document({ formatting: true }),
      swagImages: cloudinaryImage(cloudinaryConfig),

      ...group({
        label: "After The Event",
        fields: {
          winnerName: text(),
          winnerPhoto: cloudinaryImage(cloudinaryConfig),
          secondName: text(),
          secondPhoto: cloudinaryImage(cloudinaryConfig),
          thirdName: text(),
          thirdPhoto: cloudinaryImage(cloudinaryConfig),
          woodenSpoonName: text(),
          woodenSpoonPhoto: cloudinaryImage(cloudinaryConfig),
          bestPaintedName: text(),
          bestPaintedPhoto: cloudinaryImage(cloudinaryConfig),
          bestSportName: text(),
          bestSportPhoto: cloudinaryImage(cloudinaryConfig),
        },
      }),
    },
  }),

  Venue: list({
    ui: {
      listView: {
        initialColumns: ["name", "city", "flgs"],
        initialSort: { field: "name", direction: "ASC" },
      },
    },
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      flgs: checkbox({
        label: "Friendly Local Game Store",
        ui: {
          description: "Future feature: map of FLGSs where Malifaux is played",
        },
      }),
      url: text(),
      facebook: text(),
      instagram: text(),
      ...group({
        label: "Address",
        fields: {
          firstLine: text(),
          secondLine: text(),
          city: text(),
          postCode: text(),
        },
      }),
    },
  }),
} satisfies Lists;
