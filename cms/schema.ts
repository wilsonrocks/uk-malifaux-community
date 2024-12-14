import { Lists, UserPermissionType } from ".keystone/types";
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

const hasPermission =
  (permission: UserPermissionType) =>
  ({ session }: any) => {
    const permissions = session?.data?.permissions;
    if (!Array.isArray(permissions)) return false;
    if (permissions.includes("ADMIN")) return true;
    if (permissions.includes(permission)) return true;
    return false;
  };

const doesNotHavePermission =
  (permission: UserPermissionType) =>
  ({ session }: any) =>
    !hasPermission(permission)({ session });

export const lists = {
  User: list({
    access: {
      operation: allowAll,
      filter: {
        query: ({ session }) => {
          if (!session) return {};
          if (hasPermission("ADMIN")({ session })) return {};
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
        ui: {
          itemView: {
            fieldMode: "hidden",
          },
        },
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

      resources: relationship({
        ref: "Resource.author",
        many: true,
        ui: { itemView: { fieldMode: "hidden" } },
      }),
    },

    hooks: {
      // Automatically set the logged-in user as the author on create
      resolveInput: async ({ resolvedData, context, operation }) => {
        if (operation === "create") {
          const existingUserCount = await context.prisma.user.count();
          if (existingUserCount === 0)
            return {
              ...resolvedData,
              permissions: '["ADMIN"]', // TODO change if we move from sqlite?
            };
        }
        return resolvedData;
      },
    },
  }),

  Event: list({
    ui: {
      isHidden: doesNotHavePermission("TO"),
    },
    access: {
      operation: allowAll,
      item: {
        update: () => true,
        delete: () => false,
      },
      filter: {
        query: (arg: any) => {
          const { session } = arg;
          if (session === undefined) return {};

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
      slug: text({
        validation: {
          isRequired: true,
          match: {
            regex: /^([a-z0-9-]+)$/,
            explanation:
              "Can only contain lower case letters, numbers and hyphens.",
          },
        },
        isIndexed: "unique",
        ui: {
          description:
            "This will be part of the url and must be unique among all of the things of this kind. It can only contain lower case letters, numbers and hyphens.",
        },
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
      description: document({ formatting: true }),
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
      slug: text({
        validation: {
          isRequired: true,
          match: {
            regex: /^([a-z0-9-]+)$/,
            explanation:
              "Can only contain lower case letters, numbers and hyphens.",
          },
        },
        isIndexed: "unique",
        ui: {
          description:
            "This will be part of the url and must be unique among all of the things of this kind. It can only contain lower case letters, numbers and hyphens.",
        },
      }),
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
      isHidden: doesNotHavePermission("CAPTAIN"),
    },
    access: {
      operation: allowAll,
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
            captain: { connect: { id: context.session?.data.id } },
          };
        }
        return resolvedData;
      },
    },
    fields: {
      name: text(),
      slug: text({
        validation: {
          isRequired: true,
          match: {
            regex: /^([a-z0-9-]+)$/,
            explanation:
              "Can only contain lower case letters, numbers and hyphens.",
          },
        },
        isIndexed: "unique",
        ui: {
          description:
            "This will be part of the url and must be unique among all of the things of this kind. It can only contain lower case letters, numbers and hyphens.",
        },
      }),
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

  Resource: list({
    ui: {
      isHidden: ({ session }) => !hasPermission("RESOURCE_EDITOR")({ session }),
    },
    access: {
      operation: allowAll,
      filter: {
        query: ({ session }) => {
          if (!session) return {};
          if (hasPermission("ADMIN")) return {};
          return {};
        },
      },
    },
    fields: {
      name: text(),
      description: text(),
      content: document({ formatting: true }),
      author: relationship({ ref: "User.resources", many: false }),
      slug: text({
        validation: {
          isRequired: true,
          match: {
            regex: /^([a-z0-9-]+)$/,
            explanation:
              "Can only contain lower case letters, numbers and hyphens.",
          },
        },
        isIndexed: "unique",
        ui: {
          description:
            "This will be part of the url and must be unique among all of the things of this kind. It can only contain lower case letters, numbers and hyphens.",
        },
      }),
    },
  }),
} satisfies Lists;
