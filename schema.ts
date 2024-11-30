import { group, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

import {
  calendarDay,
  checkbox,
  float,
  password,
  relationship,
  select,
  text,
  timestamp,
} from "@keystone-6/core/fields";

import { document } from "@keystone-6/fields-document";

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import { UserLevelType, type Lists } from ".keystone/types";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { cloudinaryConfig } from "./config";

const anyOf: (
  funcs: (({ session }: any) => boolean)[]
) => ({ session }: any) => boolean = (funcs) => {
  return ({ session }) => funcs.map((func) => func({ session })).some((x) => x);
};

const isLevel =
  (levelString: UserLevelType | UserLevelType[]) =>
  ({ session }: any) => {
    const levelStrings = Array.isArray(levelString)
      ? levelString
      : [levelString];
    return levelStrings.some((str) => session.data.level === str);
  };

const isMaster = isLevel("MASTER");
const isHenchman = isLevel("HENCHMAN");
const isEnforcer = isLevel("ENFORCER");

const isMasterOrSameUser = anyOf([
  isLevel("MASTER"),
  ({ session }) => session.itemId === session.data.id,
]);

export const lists = {
  User: list({
    access: {
      operation: {
        create: isLevel("MASTER"),
        update: isMasterOrSameUser,
        delete: isLevel("MASTER"),
        query: () => true,
      },
      filter: {
        query: ({ session }) => {
          if (!session) return {};
          if (isMaster({ session })) return {};
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
    ui: {
      isHidden: ({ session }) =>
        !isMaster({ session }) && !isHenchman({ session }),
    },
    access: {
      operation: {
        create: ({ session }) =>
          isMaster({ session }) || isHenchman({ session }),
        update: ({ session }) => {
          return isMaster({ session }) || isHenchman({ session });
        },
        delete: ({ session }) =>
          isMaster({ session }) || isHenchman({ session }),
        query: () => true,
      },
      item: {
        update: ({ session, item }) => {
          if (isMaster({ session })) return true;
          return item.organiserId === session.data.id;
        },
        delete: ({ session, item }) => {
          if (isMaster({ session })) return true;
          return item.organiserId === session.data.id;
        },
      },
      filter: {
        query: (arg: any) => {
          const { session } = arg;
          if (session === undefined) return {};
          console.log({ arg });

          if (!session || !session.data || session.data.level === "MASTER")
            return {};
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
      venue: relationship({
        ref: "Venue",
        many: false,
      }),
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
      attendees: document(),
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

  Team: list({
    ui: {
      description: "Team stuff",
      isHidden: ({ session }) => {
        return !isMaster({ session }) && !isEnforcer({ session });
      },
    },
    access: {
      operation: {
        // TODO should this be enforcer
        create: isLevel("MASTER"),
        update: isMasterOrSameUser,
        delete: isLevel("MASTER"),
        query: () => true,
      },
      filter: {
        query: ({ session }) => {
          if (!session) return {};
          if (isMaster({ session })) return {};
          return { captain: { id: { equals: session.data.id } } };
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
      name: text(),
      location: text(),
      captain: relationship({ ref: "User" }),
      logo: cloudinaryImage(cloudinaryConfig),
      description: document(),
      ...group({
        label: "Contact",
        fields: {
          discord: text(),
          facebook: text(),
          email: text(),
        },
      }),
      members: document(),
    },
  }),
} satisfies Lists;
