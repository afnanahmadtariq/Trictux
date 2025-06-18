"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, AlertTriangle, DollarSign } from "lucide-react"

interface AIReviewProps {
  milestoneId: string
  files: any[]
  onReviewComplete: (result: any) => void
}

export function InstantAIReview({ milestoneId, files, onReviewComplete }: AIReviewProps) {
  const [reviewStatus, setReviewStatus] = useState<"analyzing" | "complete" | "failed">("analyzing")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Simulate instant AI review process
    const runAIReview = async () => {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 20
        })
      }, 200)

      // Simulate AI analysis
      setTimeout(() => {
        const mockResult = {
          score: Math.floor(Math.random() * 20) + 80, // 80-100 score
          status: Math.random() > 0.1 ? "approved" : "needs_revision", // 90% approval rate
          feedback: "AI analysis complete. All deliverables meet project requirements. Code quality is excellent.",
          analysisDetails: {
            codeQuality: 95,
            documentation: 88,
            requirements: 92,
            testCoverage: 85,
          },
          paymentApproved: true,
          reviewDate: new Date().toISOString(),
        }

        setResult(mockResult)
        setReviewStatus(mockResult.status === "approved" ? "complete" : "failed")
        onReviewComplete(mockResult)
      }, 1000) // 1 second for instant review
    }

    runAIReview()
  }, [milestoneId, files, onReviewComplete])

  if (reviewStatus === "analyzing") {
    return (
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
            <span className="font-medium text-purple-900">AI Analysis in Progress</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-purple-800">Analyzing {files.length} files against project requirements...</p>
        </CardContent>
      </Card>
    )
  }

  if (reviewStatus === "complete" && result) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">AI Review Complete</span>
            </div>
            <Badge className="bg-green-100 text-green-800">Score: {result.score}/100</Badge>
          </div>

          <p className="text-sm text-green-800 mb-3">{result.feedback}</p>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="flex justify-between">
              <span className="text-green-700">Code Quality:</span>
              <span className="font-medium">{result.analysisDetails.codeQuality}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Documentation:</span>
              <span className="font-medium">{result.analysisDetails.documentation}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Requirements:</span>
              <span className="font-medium">{result.analysisDetails.requirements}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Test Coverage:</span>
              <span className="font-medium">{result.analysisDetails.testCoverage}%</span>
            </div>
          </div>

          {result.paymentApproved && (
            <div className="flex items-center gap-2 p-2 bg-green-100 rounded">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Payment Approved & Released</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (reviewStatus === "failed" && result) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">Review Needs Attention</span>
          </div>
          <p className="text-sm text-red-800 mb-3">{result.feedback}</p>
          <Button variant="outline" size="sm" className="text-red-700 border-red-300">
            Request Revision
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
