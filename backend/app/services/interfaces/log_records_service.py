from abc import ABC, abstractmethod


class ILogRecordsService(ABC):
    """
    LogRecords interface with log management methods
    """

    @abstractmethod
    def add_record(self, log_record):
        """
        Add a log record to the database

        :param user_id: user id of the user adding the log record
        :type user_id: int
        :param resident_id: resident's id
        :param flagged: checkbox if attention is needed
        :type flagged: boolean
        :param note: note that user inputs
        :type note: string
        :param attn_to: user id of the employee with attention to
        :type attn_to: int
        :raises Exception: if user creation fails
        """
        pass

    @abstractmethod
    def get_log_records(self, page_number, filters=None):
        """
        Get all log records

        :param start_index: start index of logs that are returned
        :type start_index: int
        :param end_index: end index of logs that are returned
        :type end_index: int
        :return: object containing log list objects
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def delete_log_record(self, log_id):
        """
        Delete a log record

        :param log_id: log id of log to be deleted
        :type log_id: int
        :raises Exception: if user retrieval fails
        """
        pass

    @abstractmethod
    def update_log_record(self, log_id, updated_log_record):
        """
        Delete a log record

        :param log_id: log id of log to be updated
        :type log_id: int
        :param updated_log_record: json object from the request of the new log record
        :type updated_log_record: json object
        :raises Exception: if user retrieval fails
        """
        pass
