type VkCallbackEvent = {
  type: string;
  object: object;
  group_id: number;
  secret?: string;
  v: string;
  event_id: string;
};

export interface VkConfirmationEvent extends VkCallbackEvent {
  type: "confirmation";
  group_id: number;
}

export interface VkNewMessageEvent extends VkCallbackEvent {
  type: "message_new";
  object: {
    message: MessageObject;
    client_info: ClientInfo;
  };
  group_id: number;
}

export interface VkNewPaymentEvent extends VkCallbackEvent {
  type: "vkpay_transaction";
  object: {
    from_id: number;
    amount: number;
  };
  group_id: number;
}

export type ClientInfo = {
  button_actions: [
    "text",
    "vkpay",
    "open_app",
    "location",
    "open_link",
    "callback",
  ];
  keyboard: boolean;
};

export type MessageObject = {
  date: number;
  from_id: number;
  id: number;
  out: number;
  attachments: unknown[];
  conversation_message_id: number;
  fwd_messages: unknown[];
  important: boolean;
  is_hidden: boolean;
  peer_id: number;
  random_id: number;
  text: string;
  payload: BotPayloadType;
};

export type BotPayloadType = string;

export type VkAllEvents =
  | VkConfirmationEvent
  | VkDonutEvents
  | VkNewMessageEvent
  | VkNewPaymentEvent;

export type VkDonutEvents =
  | VkDonutSubCreateEvent
  | VkDonutSubProlongedEvent
  | VkDonutSubExpiredEvent
  | VkDonutSubCancelledEvent
  | VkDonutSubPriceChangeEvent;

export interface VkDonutSubCreateEvent extends VkCallbackEvent {
  type: "donut_subscription_create";
  object: {
    amount: number;
    amount_without_fee: number;
    user_id: number;
  };
  group_id: number;
}

export interface VkDonutSubProlongedEvent extends VkCallbackEvent {
  type: "donut_subscription_prolonged";
  object: {
    amount: number;
    amount_without_fee: number;
    user_id: number;
  };
  group_id: number;
}

export interface VkDonutSubExpiredEvent extends VkCallbackEvent {
  type: "donut_subscription_expired";
  object: {
    user_id: number;
  };
  group_id: number;
}

export interface VkDonutSubCancelledEvent extends VkCallbackEvent {
  type: "donut_subscription_cancelled";
  object: {
    user_id: number;
  };
  group_id: number;
}

export interface VkDonutSubPriceChangeEvent extends VkCallbackEvent {
  type: "donut_subscription_price_changed";
  object: {
    user_id: number;
    amount_old: number;
    amount_new: number;
    amount_diff: number;
    amount_diff_without_fee: number;
  };
  group_id: number;
}
