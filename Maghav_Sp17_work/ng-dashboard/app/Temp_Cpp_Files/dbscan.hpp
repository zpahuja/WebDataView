#ifndef DBSCAN_HPP
#define DBSCAN_HPP

#include "instance_factory.hpp"

class DBScanInstance : public pp::Instance {
	public:
		explicit DBScanInstance( PP_Instance instance)
		: pp::Instance(instance) {};
		virtual ~DBScanInstance(){};
		virtual void HandleMessage(const pp::Var& );

	private:
		int epsilon;
		int min_points;
		vector<vector<int>> clusters; // Check the dimension of clusters
		vector<int> noise;

		//Temporary variables for calculation
		vector<int> visited ;
		vector<int> assigned;
		int dataset_length = 0;

		//Main functions for DBScan
		vector<int> find_clusters(vector<int> dataset,int epsilon,int min_points);
		void expandCluster(int cluster_ID,vector<int> neighbors);
		void addToCluster(int point_ID, int cluster_ID);
		vector<int> find_neighbors(int point_ID);

		//Helper Functions
		void merge_Arrays(vector<int> &a,vector<int> b);
		float euclidean(vector<int> p, vector<int> q);


}