"use client";
import { historyQueryKey } from "@/app/utils/local-storage";
import { LocalHistory } from "@/app/interfaces/history";
import { Answer } from "@/app/components/answer";
import { Sources } from "@/app/components/sources";
import { Relates } from "@/app/components/relates";
import { Title } from "@/app/components/title";
import { Fragment } from "react";

export const HistoryResult = () => {
  const history = window.localStorage.getItem(historyQueryKey);
  if (!history) return null;
  let historyRecord: LocalHistory[];
  try {
    historyRecord = JSON.parse(history);
  } catch {
    historyRecord = [];
  }
  return historyRecord.map(
    ({ query, rid, sources, markdown, relates, timestamp }) => {
      return (
        <Fragment key={`${rid}-${timestamp}`}>
          <div className={"mt-6 border-t pt-4"}>
            <Title query={query} />
          </div>
          <div className="flex flex-col gap-8">
            <Answer markdown={markdown} sources={sources}></Answer>
            <Sources sources={sources}></Sources>
            <Relates relates={relates}></Relates>
          </div>
        </Fragment>
      );
    },
  );
};
