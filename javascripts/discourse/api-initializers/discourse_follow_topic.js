import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.includePostAttributes("topic");

  api.reopenWidget("post-menu", {
    toggleNotificationLevel() {
      const { attrs } = this;

      const level = attrs.topic.details.notification_level != 3 ? 3 : 1;

      attrs.topic.details.updateNotifications(level).then(() => {
        this.appEvents.trigger("post-stream:refresh", { id: attrs.id });
      });
    },
  });

  api.addPostMenuButton("followTopic", (attrs) => {
    if (!attrs.firstPost) {
      return;
    }

    if (attrs.topic.archetype !== "regular") {
      return;
    }

    return {
      action: "toggleNotificationLevel",
      icon: attrs.topic.details.notification_level != 3 ? "far-bell" : "bell",
      className: "follow-topic",
      title:
        attrs.topic.details.notification_level != 3
          ? "topics.follow"
          : "topics.unfollow",
      position: "first",
    };
  });
});
