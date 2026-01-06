CREATE TABLE `affiliateLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`amazonAsin` varchar(20) NOT NULL,
	`affiliateTag` varchar(255) NOT NULL,
	`affiliateUrl` varchar(512) NOT NULL,
	`keywords` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `affiliateLinks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditsTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('purchase','usage','refund','subscription_grant') NOT NULL,
	`stripeCheckoutSessionId` varchar(255),
	`description` text,
	`balanceBefore` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditsTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generationLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`topic` varchar(255) NOT NULL,
	`generatedScript` longtext NOT NULL,
	`affiliateLinksInserted` int NOT NULL DEFAULT 0,
	`creditsUsed` int NOT NULL,
	`geminiTokensUsed` int NOT NULL DEFAULT 0,
	`status` enum('success','failed','partial') NOT NULL,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generationLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(255) NOT NULL,
	`plan` enum('pro','agency') NOT NULL,
	`status` enum('active','cancelled','paused') NOT NULL DEFAULT 'active',
	`creditsPerMonth` int NOT NULL,
	`currentPeriodStart` timestamp NOT NULL,
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `plan` enum('free','pro','agency') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `credits` int DEFAULT 3 NOT NULL;