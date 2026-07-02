CREATE TABLE IF NOT EXISTS go_events (
    short_id String,
    user_agent LowCardinality(String),
    referer LowCardinality(String),
    user_ip IPv6,
    country LowCardinality(String),
    event_time DateTime64(3) DEFAULT now64()
) ENGINE = MergeTree()
ORDER BY (short_id, event_time);
