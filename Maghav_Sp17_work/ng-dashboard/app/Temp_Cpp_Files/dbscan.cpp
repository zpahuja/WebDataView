// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "dbscan.hpp"
#include "vector"
#include "string"
#include "algorithm"
#include "math"

using namespace std;

pp::Module* pp::CreateModule() {
	return new InstanceFactory<DBScanInstance>();
}

void DBScanInstance::HandleMessage(const pp::Var& globalBlocks) {
	if(!globalBlocks.is_array())
		return;
	auto data = globalBlocks;
	vector<string> names;
	names.push_back("-att-title");
	names.push_back("-style-font-size");
	names.push_back("-att-tagName");
	names.push_back("-att-className");
	names.push_back("-style-font-family");
	names.push_back("-style-width");
	names.push_back("-style-height");
	names.push_back("-att-childElementCount");
	names.push_back("-style-line-height");

	vector<string> colors;
	colors.push_back("3px solid red");
	colors.push_back("3px dotted #58D68D");
	colors.push_back("3px solid #0099ff");
	colors.push_back("3px dotted #996633");
	colors.push_back("3px solid #ffff00");
	colors.push_back("2.5px solid #884EA0");
	colors.push_back("2.5px solid #1A5276");

	vector<string> back_list;
	back_list.push_back("white");
	back_list.push_back("#58D68D");
	back_list.push_back("white");
	back_list.push_back("#c6ebeb");
	back_list.push_back("#fbb6fb");
	back_list.push_back("white");
	back_list.push_back("#ebc6eb");

	vector<int> dataset;

	for(int i=0;i<globalBlocks.GetLength();i++)
	{
		vector<int> temp;
		for(int j =0; j< names.size();j++)
		{
			if(names[j]=="-att-title"||names[j]=="-att-tagName")
			{
				auto temp_val = data.get(i);
				temp.push_back(temp_val[j].size()*100);
			}
			else if(names[j]=="-style-font-family"||names[j]=="-att-className")
			{
				auto temp_val = data.get(i);
				temp.push_back(temp_val[j].size()*300);
			}
			else if(names[j]=="-style-width"||names[j]=="-style-height")
			{
				auto temp_val = data.get(i);
				temp.push_back(temp_val[j].size()/10);
			}
			else
			{
				auto temp_val = data.get(i);
				temp.push_back(temp_val[j].size()*800);
			}
		}
		dataset.push_back(temp);
	}

	vector<vector<int>> clusters;
	clusters = find_clusters(dataset,10,7);


}
vector<vector<int>> find_clusters(dataset,epsilon,min_points)
{
	for(int point_ID = 0; point_ID < dataset_length;point_ID++)
	{
		if(visited[point_ID] !=1)
		{
			visited[point_ID] = 1;

			neighbors = find_neighbors(point_ID);

			if(neighbors.size() < min_points)
			{
				noise.push_back(point_ID);
			}
			else
			{
				int cluster_ID = clusters.size();
				vector<int> temp;
				clusters.push_back(temp);
				addToCluster(point_ID,cluster_ID);
				expandCluster(cluster_ID,neighbors);
			}
		}
	}
	return clusters;
}



void expandCluster(int cluster_ID,vector<int> neighbors)
{
	for(int i=0;i<neighbors.size();i++)
	{
		int point_ID2 = neighbors[i];

		if(visited[point_ID2] = 1)
		{
			visited[point_ID2] = 1;
			vector<int> neighbors2 = find_neighbors(point_ID2);

			if(neighbors2.size() >= min_points)
			{
				neighbors = merge_Arrays(neighbors,neighbors2);
			}
		}
	}
}

void addToCluster(int point_ID, int cluster_ID)
{
	clusters[cluster_ID].push_back(point_ID);
	assigned[point_ID] = 1;
}

// Function to find all the neighbors of a given point
vector<int> find_neighbors(int point_ID)
{
	vector<int> neighbors;

	for(int i=0;i<dataset_length;i++)
	{
		int dist = euclidean(dataset[point_ID],dataset[i]);
		if(dist < epsilon)
		{
			neighbors.push_back(i);
		}
	}
	return neighbors;
}




//***********************************************//
//Helper Functions

//Function to merge 2 arrays
void merge_Arrays(vector<int> &a, vector<int> b)
{
	a.insert(a.end(),b.begin(),b.end());
	return;
}


// Function for finding the euclidean distance in a multidimensional space
float euclidean(vector<int> p, vector<int> q)
{
	auto sum = 0;
	auto i = min(p.size(),q.size());

	while(i>0)
	{
		sum+= pow(p[i]-q[i],2);
		i--;
	}
	return sqrt(sum);
}
