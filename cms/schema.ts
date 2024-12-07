import { group, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

import {
  calendarDay,
  checkbox,
  float,
  multiselect,
  password,
  relationship,
  select,
  text,
  timestamp,
} from "@keystone-6/core/fields";

import { document } from "@keystone-6/fields-document";

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { cloudinaryConfig } from "./config";

const anyOf: (
  funcs: (({ session }: any) => boolean)[]
) => ({ session }: any) => boolean = (funcs) => {
  return ({ session }) => funcs.map((func) => func({ session })).some((x) => x);
};

const hasPermission =
  (permission: string) =>
  ({ session }: any) => {
    const permissions = session?.data?.permissions;
    if (!Array.isArray(permissions)) return false;
    if (permissions.includes("MASTER")) return true;
    if (permissions.includes(permission)) return true;
    return false;
  };

export const lists = {
  User: list({
    access: {
      operation: {
        create: hasPermission("ADMIN"),
        update: () => true,
        delete: () => true,
        query: () => true,
      },
      filter: {
        query: ({ session }) => {
          if (!session) return {};
          if (hasPermission("MASTER")({ session })) return {};
          return { id: { equals: session.data.id } };
        },
      },
    },

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),
      permissions: multiselect({
        type: "enum",
        options: [
          { value: "ADMIN", label: "Admin" },
          { value: "TO", label: "TO" },
          { value: "CAPTAIN", label: "Team Captain" },
          { value: "RESOURCE_EDITOR", label: "Resource Editor" },
        ],
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
      isHidden: ({ session }) => false,
    },
    access: {
      operation: {
        create: () => false,
        update: () => false,
        delete: () => false,
        query: () => false,
      },
      item: {
        update: () => false,
        delete: () => false,
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
              return "read";
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
        return false;
      },
    },
    access: {
      operation: {
        create: hasPermission("RESOURCE_EDITOR"),
        update: () => false,
        delete: () => false,
        query: () => true,
      },
      filter: {
        query: ({ session }) => {
          if (!session) return {};
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
